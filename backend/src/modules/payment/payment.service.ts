import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { PaystackService } from './services/paystack.service';
import { BookingService } from '../booking/booking.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private paystackService: PaystackService,
    private bookingService: BookingService,
    private kafkaProducer: KafkaProducerService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async initializePayment(userId: string, bookingId: string, email: string) {
    try {
      // Get booking details
      const booking = await this.bookingService.findOne(bookingId, userId, 'traveller');
      
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status !== 'approved') {
        throw new BadRequestException('Booking must be approved before payment');
      }

      // Generate payment reference
      const reference = this.generatePaymentReference();

      // Convert amount to kobo (Paystack uses kobo)
      const amountInKobo = Math.round(Number(booking.total) * 100);

      // Initialize payment with Paystack
      const paystackResponse = await this.paystackService.initializeTransaction({
        email,
        amount: amountInKobo,
        reference,
        callback_url: `${this.configService.get('FRONTEND_URL')}/payment-callback`,
        metadata: {
          bookingId,
          userId,
          bookingReference: booking.bookingReference,
        },
      });

      // Create payment record
      const payment = this.paymentRepository.create({
        reference,
        userId,
        bookingId,
        amount: booking.total,
        currency: booking.currency,
        status: PaymentStatus.PENDING,
        method: PaymentMethod.CARD,
        paystackReference: paystackResponse.reference,
        authorizationUrl: paystackResponse.authorization_url,
        accessCode: paystackResponse.access_code,
        paystackResponse,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Emit Kafka event
      await this.kafkaProducer.sendMessage('payment-events', {
        eventType: 'payment-initiated',
        paymentId: savedPayment.id,
        bookingId,
        userId,
        amount: booking.total,
        timestamp: new Date().toISOString(),
      });

      this.logger.info('Payment initialized', {
        context: 'PaymentService',
        paymentId: savedPayment.id,
        bookingId,
        reference,
      });

      return {
        paymentId: savedPayment.id,
        reference: savedPayment.reference,
        authorizationUrl: savedPayment.authorizationUrl,
        accessCode: savedPayment.accessCode,
      };
    } catch (error) {
      this.logger.error('Failed to initialize payment', {
        context: 'PaymentService',
        error: error.message,
        bookingId,
        userId,
      });
      throw error;
    }
  }

  async verifyPayment(reference: string) {
    try {
      // Find payment record
      const payment = await this.paymentRepository.findOne({
        where: { reference },
        relations: ['booking'],
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      // Verify with Paystack
      const paystackData = await this.paystackService.verifyTransaction(
        payment.paystackReference,
      );

      // Update payment status
      if (paystackData.status === 'success') {
        payment.status = PaymentStatus.SUCCESS;
        payment.paidAt = new Date();
        payment.paystackResponse = paystackData;

        await this.paymentRepository.save(payment);

        // Confirm booking with Amadeus
        await this.bookingService.confirmBooking(payment.bookingId);

        // Emit Kafka event
        await this.kafkaProducer.sendMessage('payment-events', {
          eventType: 'payment-success',
          paymentId: payment.id,
          bookingId: payment.bookingId,
          userId: payment.userId,
          amount: payment.amount,
          timestamp: new Date().toISOString(),
        });

        this.logger.info('Payment verified successfully', {
          context: 'PaymentService',
          paymentId: payment.id,
          reference,
        });

        return {
          success: true,
          payment,
        };
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.failedAt = new Date();
        payment.failureReason = paystackData.gateway_response || 'Payment failed';
        payment.paystackResponse = paystackData;

        await this.paymentRepository.save(payment);

        // Emit Kafka event
        await this.kafkaProducer.sendMessage('payment-events', {
          eventType: 'payment-failed',
          paymentId: payment.id,
          bookingId: payment.bookingId,
          userId: payment.userId,
          reason: payment.failureReason,
          timestamp: new Date().toISOString(),
        });

        this.logger.warn('Payment verification failed', {
          context: 'PaymentService',
          paymentId: payment.id,
          reference,
          reason: payment.failureReason,
        });

        return {
          success: false,
          message: payment.failureReason,
        };
      }
    } catch (error) {
      this.logger.error('Payment verification error', {
        context: 'PaymentService',
        error: error.message,
        reference,
      });
      throw error;
    }
  }

  async handleWebhook(payload: any, signature: string) {
    try {
      // Verify webhook signature
      const isValid = this.paystackService.verifyWebhookSignature(
        JSON.stringify(payload),
        signature,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid webhook signature');
      }

      const { event, data } = payload;

      switch (event) {
        case 'charge.success':
          await this.handleChargeSuccess(data);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(data);
          break;
        default:
          this.logger.info('Unhandled webhook event', {
            context: 'PaymentService',
            event,
          });
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Webhook handling failed', {
        context: 'PaymentService',
        error: error.message,
      });
      throw error;
    }
  }

  async findAll(userId: string, role: string): Promise<Payment[]> {
    if (role === 'traveller') {
      return this.paymentRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        relations: ['booking'],
      });
    }

    return this.paymentRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['booking', 'user'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['booking', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private async handleChargeSuccess(data: any) {
    const payment = await this.paymentRepository.findOne({
      where: { paystackReference: data.reference },
    });

    if (payment && payment.status === PaymentStatus.PENDING) {
      payment.status = PaymentStatus.SUCCESS;
      payment.paidAt = new Date();
      payment.paystackResponse = data;

      await this.paymentRepository.save(payment);

      // Confirm booking
      await this.bookingService.confirmBooking(payment.bookingId);

      // Emit Kafka event
      await this.kafkaProducer.sendMessage('payment-events', {
        eventType: 'payment-success',
        paymentId: payment.id,
        bookingId: payment.bookingId,
        userId: payment.userId,
        amount: payment.amount,
        timestamp: new Date().toISOString(),
      });

      this.logger.info('Webhook: Payment success handled', {
        context: 'PaymentService',
        paymentId: payment.id,
      });
    }
  }

  private async handleChargeFailed(data: any) {
    const payment = await this.paymentRepository.findOne({
      where: { paystackReference: data.reference },
    });

    if (payment && payment.status === PaymentStatus.PENDING) {
      payment.status = PaymentStatus.FAILED;
      payment.failedAt = new Date();
      payment.failureReason = data.gateway_response || 'Payment failed';
      payment.paystackResponse = data;

      await this.paymentRepository.save(payment);

      // Emit Kafka event
      await this.kafkaProducer.sendMessage('payment-events', {
        eventType: 'payment-failed',
        paymentId: payment.id,
        bookingId: payment.bookingId,
        userId: payment.userId,
        reason: payment.failureReason,
        timestamp: new Date().toISOString(),
      });

      this.logger.warn('Webhook: Payment failure handled', {
        context: 'PaymentService',
        paymentId: payment.id,
        reason: payment.failureReason,
      });
    }
  }

  private generatePaymentReference(): string {
    const prefix = 'PAY';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
