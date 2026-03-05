import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { SearchService } from '../search/search.service';
export declare class BookingService {
    private bookingRepository;
    private kafkaProducer;
    private searchService;
    private readonly logger;
    constructor(bookingRepository: Repository<Booking>, kafkaProducer: KafkaProducerService, searchService: SearchService, logger: Logger);
    create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(userId: string, role: string): Promise<Booking[]>;
    findOne(id: string, userId: string, role: string): Promise<Booking>;
    findPendingApprovals(): Promise<Booking[]>;
    approve(id: string, approverId: string, approveDto: ApproveBookingDto): Promise<Booking>;
    reject(id: string, rejecterId: string, rejectDto: RejectBookingDto): Promise<Booking>;
    confirmBooking(id: string): Promise<Booking>;
    private generateBookingReference;
}
