"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const booking_entity_1 = require("./entities/booking.entity");
const kafka_producer_service_1 = require("../kafka/kafka-producer.service");
const search_service_1 = require("../search/search.service");
let BookingService = class BookingService {
    constructor(bookingRepository, kafkaProducer, searchService, logger) {
        this.bookingRepository = bookingRepository;
        this.kafkaProducer = kafkaProducer;
        this.searchService = searchService;
        this.logger = logger;
    }
    async create(userId, createBookingDto) {
        try {
            const bookingReference = this.generateBookingReference();
            if (createBookingDto.flightDetails) {
                await this.searchService.validateFlightAvailability(createBookingDto.flightDetails);
            }
            const flightPrice = createBookingDto.flightPrice || 0;
            const hotelPrice = createBookingDto.hotelPrice || 0;
            const carPrice = createBookingDto.carPrice || 0;
            const subtotal = flightPrice + hotelPrice + carPrice;
            const tax = subtotal * 0.075;
            const total = subtotal + tax;
            const bookingType = createBookingDto.type;
            const { type, ...bookingData } = createBookingDto;
            const booking = this.bookingRepository.create({
                ...bookingData,
                type: bookingType,
                userId,
                bookingReference,
                flightPrice,
                hotelPrice,
                carPrice,
                subtotal,
                tax,
                total,
                status: booking_entity_1.BookingStatus.PENDING_APPROVAL,
            });
            const savedBooking = await this.bookingRepository.save(booking);
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
        }
        catch (error) {
            this.logger.error('Failed to create booking', {
                context: 'BookingService',
                error: error.message,
                userId,
            });
            throw error;
        }
    }
    async findAll(userId, role) {
        if (role === 'traveller') {
            return this.bookingRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
            });
        }
        return this.bookingRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
    }
    async findOne(id, userId, role) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (role === 'traveller' && booking.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to view this booking');
        }
        return booking;
    }
    async findPendingApprovals() {
        return this.bookingRepository.find({
            where: { status: booking_entity_1.BookingStatus.PENDING_APPROVAL },
            order: { createdAt: 'ASC' },
            relations: ['user'],
        });
    }
    async approve(id, approverId, approveDto) {
        const booking = await this.bookingRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not pending approval');
        }
        booking.status = booking_entity_1.BookingStatus.APPROVED;
        booking.approverId = approverId;
        booking.approverName = approveDto.approverName;
        booking.approvedAt = new Date();
        const updatedBooking = await this.bookingRepository.save(booking);
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
    async reject(id, rejecterId, rejectDto) {
        const booking = await this.bookingRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Booking is not pending approval');
        }
        booking.status = booking_entity_1.BookingStatus.REJECTED;
        booking.approverId = rejecterId;
        booking.approverName = rejectDto.approverName;
        booking.rejectedAt = new Date();
        booking.rejectionReason = rejectDto.reason;
        const updatedBooking = await this.bookingRepository.save(booking);
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
    async confirmBooking(id) {
        const booking = await this.bookingRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== booking_entity_1.BookingStatus.APPROVED) {
            throw new common_1.BadRequestException('Booking must be approved before confirmation');
        }
        try {
            const amadeusBooking = await this.searchService.confirmFlightBooking(booking);
            booking.status = booking_entity_1.BookingStatus.CONFIRMED;
            booking.amadeusData = amadeusBooking;
            if (amadeusBooking.pnr) {
                booking.flightDetails = {
                    ...booking.flightDetails,
                    pnr: amadeusBooking.pnr,
                };
            }
            const updatedBooking = await this.bookingRepository.save(booking);
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
        }
        catch (error) {
            booking.status = booking_entity_1.BookingStatus.FAILED;
            await this.bookingRepository.save(booking);
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
    generateBookingReference() {
        const prefix = 'BTM';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(3, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        kafka_producer_service_1.KafkaProducerService,
        search_service_1.SearchService,
        winston_1.Logger])
], BookingService);
//# sourceMappingURL=booking.service.js.map