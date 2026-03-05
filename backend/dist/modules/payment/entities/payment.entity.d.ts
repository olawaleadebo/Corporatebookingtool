import { User } from '../../users/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SUCCESS = "success",
    FAILED = "failed",
    REFUNDED = "refunded",
    CANCELLED = "cancelled"
}
export declare enum PaymentMethod {
    CARD = "card",
    BANK_TRANSFER = "bank_transfer",
    USSD = "ussd",
    MOBILE_MONEY = "mobile_money"
}
export declare class Payment {
    id: string;
    reference: string;
    userId: string;
    user: User;
    bookingId: string;
    booking: Booking;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    paystackReference: string;
    authorizationUrl: string;
    accessCode: string;
    paystackResponse: Record<string, any>;
    paidAt: Date;
    failedAt: Date;
    failureReason: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
