import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApproveBookingDto } from './dto/approve-booking.dto';
import { RejectBookingDto } from './dto/reject-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(req.user.sub, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Returns all bookings' })
  findAll(@Req() req) {
    return this.bookingService.findAll(req.user.sub, req.user.role);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending approvals' })
  @ApiResponse({ status: 200, description: 'Returns pending approvals' })
  findPendingApprovals() {
    return this.bookingService.findPendingApprovals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Returns booking details' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.bookingService.findOne(id, req.user.sub, req.user.role);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a booking' })
  @ApiResponse({ status: 200, description: 'Booking approved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  approve(
    @Param('id') id: string,
    @Req() req,
    @Body() approveDto: ApproveBookingDto,
  ) {
    return this.bookingService.approve(id, req.user.sub, approveDto);
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a booking' })
  @ApiResponse({ status: 200, description: 'Booking rejected successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  reject(
    @Param('id') id: string,
    @Req() req,
    @Body() rejectDto: RejectBookingDto,
  ) {
    return this.bookingService.reject(id, req.user.sub, rejectDto);
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm booking with Amadeus' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  confirm(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }
}
