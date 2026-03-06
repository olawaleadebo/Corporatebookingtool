import { Response } from 'express';
import { Payment, PaymentStatus } from '../models/Payment';
import { Booking, BookingStatus } from '../models/Booking';
import { PaystackService } from '../services/paystack.service';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export class PaymentController {
  private paystackService: PaystackService;

  constructor() {
    this.paystackService = new PaystackService();
  }

  async initializePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { bookingId } = req.body;

      if (!bookingId) {
        throw new AppError('Booking ID is required', 400);
      }

      // Find booking
      const booking = await Booking.findById(bookingId).populate('userId', 'email');
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check if booking belongs to user
      if (booking.userId._id.toString() !== req.user.userId) {
        throw new AppError('You do not have permission to pay for this booking', 403);
      }

      // Check if booking is approved
      if (booking.status !== BookingStatus.APPROVED) {
        throw new AppError('Booking must be approved before payment', 400);
      }

      // Generate payment reference
      const reference = `PAY-${booking.bookingReference}-${Date.now()}`;

      // Initialize payment with Paystack
      const paystackResponse = await this.paystackService.initializeTransaction({
        email: (booking.userId as any).email,
        amount: booking.total,
        reference,
        metadata: {
          bookingId: booking._id,
          bookingReference: booking.bookingReference,
        },
      });

      // Create payment record
      const payment = await Payment.create({
        bookingId: booking._id,
        userId: req.user.userId,
        amount: booking.total,
        currency: booking.currency,
        status: PaymentStatus.PENDING,
        paystackReference: reference,
        paystackAccessCode: paystackResponse.data?.access_code,
        paystackAuthorizationUrl: paystackResponse.data?.authorization_url,
        paystackResponse: paystackResponse,
      });

      logger.info('Payment initialized', {
        context: 'PaymentController',
        paymentId: payment._id,
        bookingId: booking._id,
        reference,
      });

      res.status(200).json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
          paymentId: payment._id,
          authorizationUrl: paystackResponse.data?.authorization_url,
          accessCode: paystackResponse.data?.access_code,
          reference,
        },
      });
    } catch (error: any) {
      logger.error('Initialize payment error', {
        context: 'PaymentController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to initialize payment',
        });
      }
    }
  }

  async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { reference } = req.params;

      if (!reference) {
        throw new AppError('Payment reference is required', 400);
      }

      // Find payment
      const payment = await Payment.findOne({ paystackReference: reference });
      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      // Verify payment with Paystack
      const paystackResponse = await this.paystackService.verifyTransaction(reference);

      // Update payment status
      if (paystackResponse.data?.status === 'success') {
        payment.status = PaymentStatus.SUCCESS;
        payment.paidAt = new Date();
        payment.paystackResponse = paystackResponse;
        await payment.save();

        // Update booking status to confirmed
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: BookingStatus.CONFIRMED,
        });

        logger.info('Payment verified successfully', {
          context: 'PaymentController',
          paymentId: payment._id,
          reference,
        });

        res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          data: payment,
        });
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = paystackResponse.data?.gateway_response;
        await payment.save();

        logger.warn('Payment verification failed', {
          context: 'PaymentController',
          paymentId: payment._id,
          reference,
        });

        res.status(400).json({
          success: false,
          message: 'Payment verification failed',
          data: payment,
        });
      }
    } catch (error: any) {
      logger.error('Verify payment error', {
        context: 'PaymentController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to verify payment',
        });
      }
    }
  }

  async getPaymentsByBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { bookingId } = req.params;

      const payments = await Payment.find({ bookingId }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: payments,
        count: payments.length,
      });
    } catch (error: any) {
      logger.error('Get payments error', {
        context: 'PaymentController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to get payments',
      });
    }
  }

  async refundPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { reference } = req.params;

      // Find payment
      const payment = await Payment.findOne({ paystackReference: reference });
      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      if (payment.status !== PaymentStatus.SUCCESS) {
        throw new AppError('Only successful payments can be refunded', 400);
      }

      // Process refund with Paystack
      await this.paystackService.refundTransaction(reference);

      // Update payment status
      payment.status = PaymentStatus.REFUNDED;
      await payment.save();

      // Update booking status to cancelled
      await Booking.findByIdAndUpdate(payment.bookingId, {
        status: BookingStatus.CANCELLED,
      });

      logger.info('Payment refunded', {
        context: 'PaymentController',
        paymentId: payment._id,
        reference,
      });

      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment,
      });
    } catch (error: any) {
      logger.error('Refund payment error', {
        context: 'PaymentController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to refund payment',
        });
      }
    }
  }
}
