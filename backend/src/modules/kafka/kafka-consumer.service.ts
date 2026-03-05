import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly processedMessages = new Set<string>();

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.kafka = new Kafka({
      clientId: this.configService.get('KAFKA_CLIENT_ID'),
      brokers: [this.configService.get('KAFKA_BROKER')],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: this.configService.get('KAFKA_GROUP_ID'),
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      this.logger.info('Kafka consumer connected', { context: 'KafkaConsumerService' });

      // Subscribe to topics
      await this.consumer.subscribe({
        topics: ['booking-events', 'payment-events', 'notification-events'],
        fromBeginning: false,
      });

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.logger.info('Kafka consumer started', { context: 'KafkaConsumerService' });
    } catch (error) {
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

  private async handleMessage(payload: EachMessagePayload) {
    const { topic, partition, message } = payload;
    const messageValue = message.value?.toString();

    if (!messageValue) {
      return;
    }

    try {
      const data = JSON.parse(messageValue);
      
      // Idempotency check using message offset and partition
      const messageId = `${topic}-${partition}-${message.offset}`;
      if (this.processedMessages.has(messageId)) {
        this.logger.debug('Skipping duplicate message', {
          context: 'KafkaConsumerService',
          messageId,
        });
        return;
      }

      // Process message based on topic
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

      // Mark as processed
      this.processedMessages.add(messageId);

      // Clean up old messages (keep last 10000)
      if (this.processedMessages.size > 10000) {
        const firstItem = this.processedMessages.values().next().value;
        this.processedMessages.delete(firstItem);
      }

      this.logger.info('Kafka message processed', {
        context: 'KafkaConsumerService',
        topic,
        eventType: data.eventType,
      });
    } catch (error) {
      this.logger.error('Failed to process Kafka message', {
        context: 'KafkaConsumerService',
        topic,
        error: error.message,
        message: messageValue,
      });
    }
  }

  private async handleBookingEvent(data: any) {
    // Handle booking events (update status, send notifications, etc.)
    this.logger.info('Processing booking event', {
      context: 'KafkaConsumerService',
      eventType: data.eventType,
      bookingId: data.bookingId,
    });

    // Emit to WebSocket for real-time updates
    // This will be handled by WebSocket gateway
  }

  private async handlePaymentEvent(data: any) {
    // Handle payment events (update booking status, send receipts, etc.)
    this.logger.info('Processing payment event', {
      context: 'KafkaConsumerService',
      eventType: data.eventType,
      paymentId: data.paymentId,
    });

    // Emit to WebSocket for real-time updates
  }

  private async handleNotificationEvent(data: any) {
    // Handle notification events (send emails, SMS, push notifications, etc.)
    this.logger.info('Processing notification event', {
      context: 'KafkaConsumerService',
      eventType: data.eventType,
      userId: data.userId,
    });
  }
}
