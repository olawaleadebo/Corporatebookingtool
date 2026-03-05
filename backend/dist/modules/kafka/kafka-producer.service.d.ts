import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
export declare class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private kafka;
    private producer;
    constructor(configService: ConfigService, logger: Logger);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    sendMessage(topic: string, message: any): Promise<void>;
    sendBatch(topic: string, messages: any[]): Promise<void>;
}
