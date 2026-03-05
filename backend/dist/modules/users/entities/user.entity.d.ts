import { Booking } from '@/modules/booking/entities/booking.entity';
import { Payment } from '@/modules/payment/entities/payment.entity';
export declare enum UserRole {
    TRAVELLER = "traveller",
    TRAVEL_ARRANGER = "travel_arranger",
    ADMIN = "admin",
    SUPPORT = "support"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    status: UserStatus;
    companyId: string;
    department: string;
    costCenter: string;
    managerId: string;
    metadata: Record<string, any>;
    refreshToken: string | any;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    bookings: Booking[];
    payments: Payment[];
    get fullName(): string;
}
