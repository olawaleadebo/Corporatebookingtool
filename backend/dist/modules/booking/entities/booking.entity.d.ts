import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';
export declare enum BookingStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum BookingType {
    FLIGHT = "flight",
    HOTEL = "hotel",
    CAR = "car",
    COMBINED = "combined"
}
export declare class Booking {
    id: string;
    bookingReference: string;
    userId: string;
    user: User;
    type: BookingType;
    status: BookingStatus;
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
    hotelDetails: {
        name: string;
        location: string;
        checkIn: string;
        checkOut: string;
        nights: number;
        roomType: string;
        confirmationNumber?: string;
    };
    carDetails: {
        name: string;
        category: string;
        transmission: string;
        pickupDate: string;
        dropoffDate: string;
        days: number;
        confirmationNumber?: string;
    };
    flightPrice: number;
    hotelPrice: number;
    carPrice: number;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    justification: string;
    costCenter: string;
    projectCode: string;
    approverId: string;
    approverName: string;
    approvedAt: Date;
    rejectedAt: Date;
    rejectionReason: string;
    amadeusData: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    payments: Payment[];
}
