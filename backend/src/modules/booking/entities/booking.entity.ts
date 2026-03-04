import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';

export enum BookingStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum BookingType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  CAR = 'car',
  COMBINED = 'combined',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  bookingReference: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: BookingType,
    default: BookingType.COMBINED,
  })
  @Index()
  type: BookingType;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.DRAFT,
  })
  @Index()
  status: BookingStatus;

  // Flight details
  @Column({ type: 'jsonb', nullable: true })
  flightDetails: {
    airline: string;
    flightNumber: string;
    departure: {
      airport: string;
      city: string;
      time: string;
      date: string;
    };
    arrival: {
      airport: string;
      city: string;
      time: string;
      date: string;
    };
    duration: string;
    class: string;
    pnr?: string;
    ticketNumber?: string;
  };

  // Hotel details
  @Column({ type: 'jsonb', nullable: true })
  hotelDetails: {
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    roomType: string;
    confirmationNumber?: string;
  };

  // Car rental details
  @Column({ type: 'jsonb', nullable: true })
  carDetails: {
    name: string;
    category: string;
    transmission: string;
    pickupDate: string;
    dropoffDate: string;
    days: number;
    confirmationNumber?: string;
  };

  // Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  flightPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  hotelPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  carPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'NGN', length: 3 })
  currency: string;

  // Business justification
  @Column({ type: 'text' })
  justification: string;

  @Column({ nullable: true })
  costCenter: string;

  @Column({ nullable: true })
  projectCode: string;

  // Approval workflow
  @Column({ nullable: true })
  @Index()
  approverId: string;

  @Column({ nullable: true })
  approverName: string;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Amadeus integration
  @Column({ type: 'jsonb', nullable: true })
  amadeusData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];
}
