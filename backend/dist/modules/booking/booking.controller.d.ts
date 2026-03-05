import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(req: any, createBookingDto: CreateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    findAll(req: any): Promise<import("./entities/booking.entity").Booking[]>;
    findPendingApprovals(): Promise<import("./entities/booking.entity").Booking[]>;
    findOne(id: string, req: any): Promise<import("./entities/booking.entity").Booking>;
    approve(id: string, req: any, approveDto: ApproveBookingDto): Promise<import("./entities/booking.entity").Booking>;
    reject(id: string, req: any, rejectDto: RejectBookingDto): Promise<import("./entities/booking.entity").Booking>;
    confirm(id: string): Promise<import("./entities/booking.entity").Booking>;
}
