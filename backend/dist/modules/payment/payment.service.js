"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const payment_entity_1 = require("./entities/payment.entity");
const paystack_service_1 = require("./services/paystack.service");
const booking_service_1 = require("../booking/booking.service");
const kafka_producer_service_1 = require("../kafka/kafka-producer.service");
const config_1 = require("@nestjs/config");
let PaymentService = class PaymentService {
    constructor(paymentRepository, paystackService, bookingService, kafkaProducer, configService, logger) {
        this.paymentRepository = paymentRepository;
        this.paystackService = paystackService;
        this.bookingService = bookingService;
        this.kafkaProducer = kafkaProducer;
        this.configService = configService;
        this.logger = logger;
    }
    async initializePayment(userId, bookingId, email) {
        try {
            const booking = await this.bookingService.findOne(bookingId, userId, 'traveller');
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            if (booking.status !== 'approved') {
                throw new common_1.BadRequestException('Booking must be approved before payment');
            }
            const reference = this.generatePaymentReference();
            const amountInKobo = Math.round(Number(booking.total) * 100);
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
            const payment = this.paymentRepository.create({
                reference,
                userId,
                bookingId,
                amount: booking.total,
                currency: booking.currency,
                status: payment_entity_1.PaymentStatus.PENDING,
                method: payment_entity_1.PaymentMethod.CARD,
                paystackReference: paystackResponse.reference,
                authorizationUrl: paystackResponse.authorization_url,
                accessCode: paystackResponse.access_code,
                paystackResponse,
            });
            const savedPayment = await this.paymentRepository.save(payment);
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
        }
        catch (error) {
            this.logger.error('Failed to initialize payment', {
                context: 'PaymentService',
                error: error.message,
                bookingId,
                userId,
            });
            throw error;
        }
    }
    async verifyPayment(reference) {
        try {
            const payment = await this.paymentRepository.findOne({
                where: { reference },
                relations: ['booking'],
            });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            const paystackData = await this.paystackService.verifyTransaction(payment.paystackReference);
            if (paystackData.status === 'success') {
                payment.status = payment_entity_1.PaymentStatus.SUCCESS;
                payment.paidAt = new Date();
                payment.paystackResponse = paystackData;
                await this.paymentRepository.save(payment);
                await this.bookingService.confirmBooking(payment.bookingId);
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
            }
            else {
                payment.status = payment_entity_1.PaymentStatus.FAILED;
                payment.failedAt = new Date();
                payment.failureReason = paystackData.gateway_response || 'Payment failed';
                payment.paystackResponse = paystackData;
                await this.paymentRepository.save(payment);
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
        }
        catch (error) {
            this.logger.error('Payment verification error', {
                context: 'PaymentService',
                error: error.message,
                reference,
            });
            throw error;
        }
    }
    async handleWebhook(payload, signature) {
        try {
            const isValid = this.paystackService.verifyWebhookSignature(JSON.stringify(payload), signature);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid webhook signature');
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
        }
        catch (error) {
            this.logger.error('Webhook handling failed', {
                context: 'PaymentService',
                error: error.message,
            });
            throw error;
        }
    }
    async findAll(userId, role) {
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
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['booking', 'user'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async handleChargeSuccess(data) {
        const payment = await this.paymentRepository.findOne({
            where: { paystackReference: data.reference },
        });
        if (payment && payment.status === payment_entity_1.PaymentStatus.PENDING) {
            payment.status = payment_entity_1.PaymentStatus.SUCCESS;
            payment.paidAt = new Date();
            payment.paystackResponse = data;
            await this.paymentRepository.save(payment);
            await this.bookingService.confirmBooking(payment.bookingId);
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
    async handleChargeFailed(data) {
        const payment = await this.paymentRepository.findOne({
            where: { paystackReference: data.reference },
        });
        if (payment && payment.status === payment_entity_1.PaymentStatus.PENDING) {
            payment.status = payment_entity_1.PaymentStatus.FAILED;
            payment.failedAt = new Date();
            payment.failureReason = data.gateway_response || 'Payment failed';
            payment.paystackResponse = data;
            await this.paymentRepository.save(payment);
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
    generatePaymentReference() {
        const prefix = 'PAY';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(5, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        paystack_service_1.PaystackService,
        booking_service_1.BookingService,
        kafka_producer_service_1.KafkaProducerService,
        config_1.ConfigService,
        winston_1.Logger])
], PaymentService);
//# sourceMappingURL=payment.service.js.map