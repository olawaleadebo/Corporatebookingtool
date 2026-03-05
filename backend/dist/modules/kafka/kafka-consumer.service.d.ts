import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
export declare class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private kafka;
    private consumer;
    private readonly processedMessages;
    constructor(configService: ConfigService, logger: Logger);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private handleMessage;
    private handleBookingEvent;
    private handlePaymentEvent;
    private handleNotificationEvent;
}
