import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private kafkaProducer: KafkaProducerService,
    private searchService: SearchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      // Generate unique booking reference
      const bookingReference = this.generateBookingReference();

      // Validate flight availability with Amadeus
      if (createBookingDto.flightDetails) {
        await this.searchService.validateFlightAvailability(createBookingDto.flightDetails);
      }

      // Calculate pricing
      const flightPrice = createBookingDto.flightPrice || 0;
      const hotelPrice = createBookingDto.hotelPrice || 0;
      const carPrice = createBookingDto.carPrice || 0;
      const subtotal = flightPrice + hotelPrice + carPrice;
      const tax = subtotal * 0.075; // 7.5% VAT
      const total = subtotal + tax;

      // Create booking
      const booking = this.bookingRepository.create({
        ...createBookingDto,
        userId,
        bookingReference,
        flightPrice,
        hotelPrice,
        carPrice,
        subtotal,
        tax,
        total,
        status: BookingStatus.PENDING_APPROVAL,
      });

      const savedBooking = await this.bookingRepository.save(booking);

      // Emit Kafka event
      await this.kafkaProducer.sendMessage('booking-events', {
        eventType: 'booking-created',
        bookingId: savedBooking.id,
        userId,
        amount: total,
        timestamp: new Date().toISOString(),
      });

      this.logger.info('Booking created successfully', {
        context: 'BookingService',
        bookingId: savedBooking.id,
        userId,
      });

      return savedBooking;
    } catch (error) {
      this.logger.error('Failed to create booking', {
        context: 'BookingService',
        error: error.message,
        userId,
      });
      throw error;
    }
  }

  async findAll(userId: string, role: string): Promise<Booking[]> {
    // If user is a traveller, only show their bookings
    if (role === 'traveller') {
      return this.bookingRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    }

    // Travel arrangers and admins can see all bookings
    return this.bookingRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findOne(id: string, userId: string, role: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (role === 'traveller' && booking.userId !== userId) {
      throw new BadRequestException('You do not have permission to view this booking');
    }

    return booking;
  }

  async findPendingApprovals(): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { status: BookingStatus.PENDING_APPROVAL },
      order: { createdAt: 'ASC' },
      relations: ['user'],
    });
  }

  async approve(id: string, approverId: string, approveDto: ApproveBookingDto): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Booking is not pending approval');
    }

    booking.status = BookingStatus.APPROVED;
    booking.approverId = approverId;
    booking.approverName = approveDto.approverName;
    booking.approvedAt = new Date();

    const updatedBooking = await this.bookingRepository.save(booking);

    // Emit Kafka event
    await this.kafkaProducer.sendMessage('booking-events', {
      eventType: 'booking-approved',
      bookingId: booking.id,
      userId: booking.userId,
      approverId,
      timestamp: new Date().toISOString(),
    });

    this.logger.info('Booking approved', {
      context: 'BookingService',
      bookingId: booking.id,
      approverId,
    });

    return updatedBooking;
  }

  async reject(id: string, rejecterId: string, rejectDto: RejectBookingDto): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Booking is not pending approval');
    }

    booking.status = BookingStatus.REJECTED;
    booking.approverId = rejecterId;
    booking.approverName = rejectDto.approverName;
    booking.rejectedAt = new Date();
    booking.rejectionReason = rejectDto.reason;

    const updatedBooking = await this.bookingRepository.save(booking);

    // Emit Kafka event
    await this.kafkaProducer.sendMessage('booking-events', {
      eventType: 'booking-rejected',
      bookingId: booking.id,
      userId: booking.userId,
      rejecterId,
      reason: rejectDto.reason,
      timestamp: new Date().toISOString(),
    });

    this.logger.info('Booking rejected', {
      context: 'BookingService',
      bookingId: booking.id,
      rejecterId,
    });

    return updatedBooking;
  }

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new BadRequestException('Booking must be approved before confirmation');
    }

    // Book with Amadeus
    try {
      const amadeusBooking = await this.searchService.confirmFlightBooking(booking);
      
      booking.status = BookingStatus.CONFIRMED;
      booking.amadeusData = amadeusBooking;
      
      // Update PNR if available
      if (amadeusBooking.pnr) {
        booking.flightDetails = {
          ...booking.flightDetails,
          pnr: amadeusBooking.pnr,
        };
      }

      const updatedBooking = await this.bookingRepository.save(booking);

      // Emit Kafka event
      await this.kafkaProducer.sendMessage('booking-events', {
        eventType: 'booking-confirmed',
        bookingId: booking.id,
        userId: booking.userId,
        timestamp: new Date().toISOString(),
      });

      this.logger.info('Booking confirmed', {
        context: 'BookingService',
        bookingId: booking.id,
      });

      return updatedBooking;
    } catch (error) {
      booking.status = BookingStatus.FAILED;
      await this.bookingRepository.save(booking);

      // Emit Kafka event
      await this.kafkaProducer.sendMessage('booking-events', {
        eventType: 'booking-failed',
        bookingId: booking.id,
        userId: booking.userId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  private generateBookingReference(): string {
    const prefix = 'BTM';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
