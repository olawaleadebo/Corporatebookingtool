import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { Payment } from './entities/payment.entity';
import { PaystackService } from './services/paystack.service';
import { BookingService } from '../booking/booking.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private paymentRepository;
    private paystackService;
    private bookingService;
    private kafkaProducer;
    private configService;
    private readonly logger;
    constructor(paymentRepository: Repository<Payment>, paystackService: PaystackService, bookingService: BookingService, kafkaProducer: KafkaProducerService, configService: ConfigService, logger: Logger);
    initializePayment(userId: string, bookingId: string, email: string): Promise<{
        paymentId: string;
        reference: string;
        authorizationUrl: string;
        accessCode: string;
    }>;
    verifyPayment(reference: string): Promise<{
        success: boolean;
        payment: Payment;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        payment?: undefined;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    findAll(userId: string, role: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    private handleChargeSuccess;
    private handleChargeFailed;
    private generatePaymentReference;
}
