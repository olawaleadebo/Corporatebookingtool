import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaystackService } from './services/paystack.service';
import { Payment } from './entities/payment.entity';
import { BookingModule } from '../booking/booking.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule,
    BookingModule,
    KafkaModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackService],
  exports: [PaymentService],
})
export class PaymentModule {}
