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
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
let KafkaConsumerService = class KafkaConsumerService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.processedMessages = new Set();
        this.kafka = new kafkajs_1.Kafka({
            clientId: this.configService.get('KAFKA_CLIENT_ID') || 'btmtravel-cobt',
            brokers: [this.configService.get('KAFKA_BROKER') || 'localhost:9092'],
            retry: {
                initialRetryTime: 100,
                retries: 8,
            },
        });
        this.consumer = this.kafka.consumer({
            groupId: this.configService.get('KAFKA_GROUP_ID') || 'btmtravel-group',
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
        });
    }
    async onModuleInit() {
        try {
            await this.consumer.connect();
            this.logger.info('Kafka consumer connected', { context: 'KafkaConsumerService' });
            await this.consumer.subscribe({
                topics: ['booking-events', 'payment-events', 'notification-events'],
                fromBeginning: false,
            });
            await this.consumer.run({
                eachMessage: async (payload) => {
                    await this.handleMessage(payload);
                },
            });
            this.logger.info('Kafka consumer started', { context: 'KafkaConsumerService' });
        }
        catch (error) {
            this.logger.error('Failed to start Kafka consumer', {
                context: 'KafkaConsumerService',
                error: error.message,
            });
        }
    }
    async onModuleDestroy() {
        await this.consumer.disconnect();
        this.logger.info('Kafka consumer disconnected', { context: 'KafkaConsumerService' });
    }
    async handleMessage(payload) {
        const { topic, partition, message } = payload;
        const messageValue = message.value?.toString();
        if (!messageValue) {
            return;
        }
        try {
            const data = JSON.parse(messageValue);
            const messageId = `${topic}-${partition}-${message.offset}`;
            if (this.processedMessages.has(messageId)) {
                this.logger.debug('Skipping duplicate message', {
                    context: 'KafkaConsumerService',
                    messageId,
                });
                return;
            }
            switch (topic) {
                case 'booking-events':
                    await this.handleBookingEvent(data);
                    break;
                case 'payment-events':
                    await this.handlePaymentEvent(data);
                    break;
                case 'notification-events':
                    await this.handleNotificationEvent(data);
                    break;
                default:
                    this.logger.warn('Unknown topic', { context: 'KafkaConsumerService', topic });
            }
            this.processedMessages.add(messageId);
            if (this.processedMessages.size > 10000) {
                const firstItem = this.processedMessages.values().next().value;
                this.processedMessages.delete(firstItem);
            }
            this.logger.info('Kafka message processed', {
                context: 'KafkaConsumerService',
                topic,
                eventType: data.eventType,
            });
        }
        catch (error) {
            this.logger.error('Failed to process Kafka message', {
                context: 'KafkaConsumerService',
                topic,
                error: error.message,
                message: messageValue,
            });
        }
    }
    async handleBookingEvent(data) {
        this.logger.info('Processing booking event', {
            context: 'KafkaConsumerService',
            eventType: data.eventType,
            bookingId: data.bookingId,
        });
    }
    async handlePaymentEvent(data) {
        this.logger.info('Processing payment event', {
            context: 'KafkaConsumerService',
            eventType: data.eventType,
            paymentId: data.paymentId,
        });
    }
    async handleNotificationEvent(data) {
        this.logger.info('Processing notification event', {
            context: 'KafkaConsumerService',
            eventType: data.eventType,
            userId: data.userId,
        });
    }
};
exports.KafkaConsumerService = KafkaConsumerService;
exports.KafkaConsumerService = KafkaConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger])
], KafkaConsumerService);
//# sourceMappingURL=kafka-consumer.service.js.map