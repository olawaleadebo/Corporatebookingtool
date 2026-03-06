import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
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
  FLIGHT_HOTEL = 'flight_hotel',
  FLIGHT_CAR = 'flight_car',
  HOTEL_CAR = 'hotel_car',
  COMPLETE = 'complete',
}

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  bookingReference: string;
  type: BookingType;
  status: BookingStatus;
  
  // Flight details
  flightDetails?: {
    airline: string;
    flightNumber: string;
    departure: {
      airport: string;
      city: string;
      date: string;
      time: string;
    };
    arrival: {
      airport: string;
      city: string;
      date: string;
      time: string;
    };
    cabin: string;
    pnr?: string;
  };
  
  // Hotel details
  hotelDetails?: {
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    nights: number;
  };
  
  // Car details
  carDetails?: {
    company: string;
    carType: string;
    pickupLocation: string;
    pickupDate: string;
    dropoffLocation: string;
    dropoffDate: string;
    days: number;
  };
  
  // Pricing
  flightPrice: number;
  hotelPrice: number;
  carPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  
  // Approval workflow
  approverId?: mongoose.Types.ObjectId;
  approverName?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // Additional data
  amadeusData?: any;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(BookingType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING_APPROVAL,
      index: true,
    },
    
    // Flight details
    flightDetails: {
      airline: String,
      flightNumber: String,
      departure: {
        airport: String,
        city: String,
        date: String,
        time: String,
      },
      arrival: {
        airport: String,
        city: String,
        date: String,
        time: String,
      },
      cabin: String,
      pnr: String,
    },
    
    // Hotel details
    hotelDetails: {
      name: String,
      location: String,
      checkIn: String,
      checkOut: String,
      roomType: String,
      nights: Number,
    },
    
    // Car details
    carDetails: {
      company: String,
      carType: String,
      pickupLocation: String,
      pickupDate: String,
      dropoffLocation: String,
      dropoffDate: String,
      days: Number,
    },
    
    // Pricing
    flightPrice: {
      type: Number,
      default: 0,
    },
    hotelPrice: {
      type: Number,
      default: 0,
    },
    carPrice: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    
    // Approval workflow
    approverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approverName: String,
    approvedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    
    // Additional data
    amadeusData: Schema.Types.Mixed,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ bookingReference: 1 });
BookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
