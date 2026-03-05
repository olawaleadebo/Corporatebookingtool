import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID') || 'btmtravel-cobt',
      brokers: [this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092'],
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
    } catch (error) {
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

  async sendMessage(topic: string, message: any) {
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
    } catch (error) {
      this.logger.error('Failed to send Kafka message', {
        context: 'KafkaProducerService',
        topic,
        error: error.message,
      });
      throw error;
    }
  }

  async sendBatch(topic: string, messages: any[]) {
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
    } catch (error) {
      this.logger.error('Failed to send Kafka batch messages', {
        context: 'KafkaProducerService',
        topic,
        error: error.message,
      });
      throw error;
    }
  }
}
