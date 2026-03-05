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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Booking type', example: 'combined' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Flight details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBookingDto.prototype, "flightDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hotel details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBookingDto.prototype, "hotelDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Car rental details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBookingDto.prototype, "carDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Flight price in Naira', example: 125000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "flightPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hotel price in Naira', example: 85000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "hotelPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Car rental price in Naira', example: 35000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "carPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business justification for trip' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "justification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cost center code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "costCenter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "projectCode", void 0);
//# sourceMappingURL=create-booking.dto.js.map