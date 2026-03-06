import { Response } from 'express';
import { Booking, BookingStatus, BookingType } from '../models/Booking';
import { User, UserRole } from '../models/User';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { AmadeusService } from '../services/amadeus.service';

export class BookingController {
  private amadeusService: AmadeusService;

  constructor() {
    this.amadeusService = new AmadeusService();
  }

  async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const {
        type,
        flightDetails,
        hotelDetails,
        carDetails,
        flightPrice = 0,
        hotelPrice = 0,
        carPrice = 0,
        notes,
      } = req.body;

      if (!type) {
        throw new AppError('Booking type is required', 400);
      }

      // Generate unique booking reference
      const bookingReference = this.generateBookingReference();

      // Calculate pricing
      const subtotal = flightPrice + hotelPrice + carPrice;
      const tax = subtotal * 0.075; // 7.5% VAT
      const total = subtotal + tax;

      // Create booking
      const booking = await Booking.create({
        userId: req.user.userId,
        bookingReference,
        type,
        status: BookingStatus.PENDING_APPROVAL,
        flightDetails,
        hotelDetails,
        carDetails,
        flightPrice,
        hotelPrice,
        carPrice,
        subtotal,
        tax,
        total,
        currency: 'NGN',
        notes,
      });

      logger.info('Booking created successfully', {
        context: 'BookingController',
        bookingId: booking._id,
        userId: req.user.userId,
        reference: bookingReference,
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error: any) {
      logger.error('Create booking error', {
        context: 'BookingController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create booking',
        });
      }
    }
  }

  async getBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      let query: any = {};

      // Travellers can only see their own bookings
      if (req.user.role === UserRole.TRAVELLER) {
        query.userId = req.user.userId;
      }

      const bookings = await Booking.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('approverId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: bookings,
        count: bookings.length,
      });
    } catch (error: any) {
      logger.error('Get bookings error', {
        context: 'BookingController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to get bookings',
      });
    }
  }

  async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;

      const booking = await Booking.findById(id)
        .populate('userId', 'firstName lastName email')
        .populate('approverId', 'firstName lastName email');

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check permissions
      if (
        req.user.role === UserRole.TRAVELLER &&
        booking.userId._id.toString() !== req.user.userId
      ) {
        throw new AppError('You do not have permission to view this booking', 403);
      }

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error: any) {
      logger.error('Get booking error', {
        context: 'BookingController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to get booking',
        });
      }
    }
  }

  async getPendingApprovals(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const bookings = await Booking.find({ status: BookingStatus.PENDING_APPROVAL })
        .populate('userId', 'firstName lastName email department')
        .sort({ createdAt: 1 });

      res.status(200).json({
        success: true,
        data: bookings,
        count: bookings.length,
      });
    } catch (error: any) {
      logger.error('Get pending approvals error', {
        context: 'BookingController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to get pending approvals',
      });
    }
  }

  async approveBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;
      const { approverName } = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status !== BookingStatus.PENDING_APPROVAL) {
        throw new AppError('Booking is not pending approval', 400);
      }

      booking.status = BookingStatus.APPROVED;
      booking.approverId = req.user.userId as any;
      booking.approverName = approverName || `${req.user.email}`;
      booking.approvedAt = new Date();

      await booking.save();

      logger.info('Booking approved', {
        context: 'BookingController',
        bookingId: booking._id,
        approverId: req.user.userId,
      });

      res.status(200).json({
        success: true,
        message: 'Booking approved successfully',
        data: booking,
      });
    } catch (error: any) {
      logger.error('Approve booking error', {
        context: 'BookingController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to approve booking',
        });
      }
    }
  }

  async rejectBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;
      const { reason, approverName } = req.body;

      if (!reason) {
        throw new AppError('Rejection reason is required', 400);
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status !== BookingStatus.PENDING_APPROVAL) {
        throw new AppError('Booking is not pending approval', 400);
      }

      booking.status = BookingStatus.REJECTED;
      booking.approverId = req.user.userId as any;
      booking.approverName = approverName || `${req.user.email}`;
      booking.rejectedAt = new Date();
      booking.rejectionReason = reason;

      await booking.save();

      logger.info('Booking rejected', {
        context: 'BookingController',
        bookingId: booking._id,
        approverId: req.user.userId,
      });

      res.status(200).json({
        success: true,
        message: 'Booking rejected successfully',
        data: booking,
      });
    } catch (error: any) {
      logger.error('Reject booking error', {
        context: 'BookingController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to reject booking',
        });
      }
    }
  }

  async confirmBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { id } = req.params;

      const booking = await Booking.findById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status !== BookingStatus.APPROVED) {
        throw new AppError('Booking must be approved before confirmation', 400);
      }

      // For flight bookings, confirm with Amadeus
      if (booking.flightDetails && booking.amadeusData) {
        try {
          const amadeusBooking = await this.amadeusService.createFlightOrder(
            booking.amadeusData,
            [
              {
                id: '1',
                dateOfBirth: '1990-01-01',
                name: {
                  firstName: 'Test',
                  lastName: 'User',
                },
                gender: 'MALE',
                contact: {
                  emailAddress: 'test@example.com',
                  phones: [
                    {
                      deviceType: 'MOBILE',
                      countryCallingCode: '234',
                      number: '8012345678',
                    },
                  ],
                },
              },
            ]
          );

          if (amadeusBooking.associatedRecords?.[0]?.reference) {
            booking.flightDetails.pnr = amadeusBooking.associatedRecords[0].reference;
          }
        } catch (error: any) {
          logger.error('Amadeus booking confirmation failed', {
            context: 'BookingController',
            error: error.message,
            bookingId: booking._id,
          });
        }
      }

      booking.status = BookingStatus.CONFIRMED;
      await booking.save();

      logger.info('Booking confirmed', {
        context: 'BookingController',
        bookingId: booking._id,
      });

      res.status(200).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking,
      });
    } catch (error: any) {
      logger.error('Confirm booking error', {
        context: 'BookingController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to confirm booking',
        });
      }
    }
  }

  private generateBookingReference(): string {
    const prefix = 'BTM';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
