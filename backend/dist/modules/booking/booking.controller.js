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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const booking_service_1 = require("./booking.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const approve_booking_dto_1 = require("./dto/approve-booking.dto");
const reject_booking_dto_1 = require("./dto/reject-booking.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    create(req, createBookingDto) {
        return this.bookingService.create(req.user.sub, createBookingDto);
    }
    findAll(req) {
        return this.bookingService.findAll(req.user.sub, req.user.role);
    }
    findPendingApprovals() {
        return this.bookingService.findPendingApprovals();
    }
    findOne(id, req) {
        return this.bookingService.findOne(id, req.user.sub, req.user.role);
    }
    approve(id, req, approveDto) {
        return this.bookingService.approve(id, req.user.sub, approveDto);
    }
    reject(id, req, rejectDto) {
        return this.bookingService.reject(id, req.user.sub, rejectDto);
    }
    confirm(id) {
        return this.bookingService.confirmBooking(id);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all bookings' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending approvals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns pending approvals' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findPendingApprovals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns booking details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking approved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, approve_booking_dto_1.ApproveBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking rejected successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reject_booking_dto_1.RejectBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm booking with Amadeus' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "confirm", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map