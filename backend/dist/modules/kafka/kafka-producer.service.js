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
exports.KafkaProducerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
let KafkaProducerService = class KafkaProducerService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.kafka = new kafkajs_1.Kafka({
            clientId: this.configService.get('KAFKA_CLIENT_ID') || 'btmtravel-cobt',
            brokers: [this.configService.get('KAFKA_BROKER') || 'localhost:9092'],
            retry: {
                initialRetryTime: 100,
                retries: 8,
            },
        });
        this.producer = this.kafka.producer({
            allowAutoTopicCreation: true,
            transactionTimeout: 30000,
        });
    }
    async onModuleInit() {
        try {
            await this.producer.connect();
            this.logger.info('Kafka producer connected', { context: 'KafkaProducerService' });
        }
        catch (error) {
            this.logger.error('Failed to connect Kafka producer', {
                context: 'KafkaProducerService',
                error: error.message,
            });
        }
    }
    async onModuleDestroy() {
        await this.producer.disconnect();
        this.logger.info('Kafka producer disconnected', { context: 'KafkaProducerService' });
    }
    async sendMessage(topic, message) {
        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: message.eventType || 'event',
                        value: JSON.stringify(message),
                        timestamp: Date.now().toString(),
                    },
                ],
            });
            this.logger.info('Kafka message sent', {
                context: 'KafkaProducerService',
                topic,
                eventType: message.eventType,
            });
        }
        catch (error) {
            this.logger.error('Failed to send Kafka message', {
                context: 'KafkaProducerService',
                topic,
                error: error.message,
            });
            throw error;
        }
    }
    async sendBatch(topic, messages) {
        try {
            await this.producer.send({
                topic,
                messages: messages.map((message) => ({
                    key: message.eventType || 'event',
                    value: JSON.stringify(message),
                    timestamp: Date.now().toString(),
                })),
            });
            this.logger.info('Kafka batch messages sent', {
                context: 'KafkaProducerService',
                topic,
                count: messages.length,
            });
        }
        catch (error) {
            this.logger.error('Failed to send Kafka batch messages', {
                context: 'KafkaProducerService',
                topic,
                error: error.message,
            });
            throw error;
        }
    }
};
exports.KafkaProducerService = KafkaProducerService;
exports.KafkaProducerService = KafkaProducerService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger])
], KafkaProducerService);
//# sourceMappingURL=kafka-producer.service.js.map