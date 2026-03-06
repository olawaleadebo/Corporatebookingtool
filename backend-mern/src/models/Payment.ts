import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  
  // Paystack details
  paystackReference?: string;
  paystackAccessCode?: string;
  paystackAuthorizationUrl?: string;
  paystackResponse?: any;
  
  // Payment metadata
  paymentMethod?: string;
  paidAt?: Date;
  failureReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    
    // Paystack details
    paystackReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    paystackAccessCode: String,
    paystackAuthorizationUrl: String,
    paystackResponse: Schema.Types.Mixed,
    
    // Payment metadata
    paymentMethod: String,
    paidAt: Date,
    failureReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ paystackReference: 1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
