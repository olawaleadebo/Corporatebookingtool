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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingType = exports.BookingStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const payment_entity_1 = require("../../payment/entities/payment.entity");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["DRAFT"] = "draft";
    BookingStatus["PENDING_APPROVAL"] = "pending_approval";
    BookingStatus["APPROVED"] = "approved";
    BookingStatus["REJECTED"] = "rejected";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["FAILED"] = "failed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var BookingType;
(function (BookingType) {
    BookingType["FLIGHT"] = "flight";
    BookingType["HOTEL"] = "hotel";
    BookingType["CAR"] = "car";
    BookingType["COMBINED"] = "combined";
})(BookingType || (exports.BookingType = BookingType = {}));
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Booking.prototype, "bookingReference", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingType,
        default: BookingType.COMBINED,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Booking.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.DRAFT,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "flightDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "hotelDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "carDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "flightPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "hotelPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "carPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'NGN', length: 3 }),
    __metadata("design:type", String)
], Booking.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Booking.prototype, "justification", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "costCenter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "projectCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Booking.prototype, "approverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "approverName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Booking.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Booking.prototype, "rejectedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "amadeusData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.booking),
    __metadata("design:type", Array)
], Booking.prototype, "payments", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);
//# sourceMappingURL=booking.entity.js.map