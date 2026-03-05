"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const paystack_service_1 = require("./services/paystack.service");
const payment_entity_1 = require("./entities/payment.entity");
const booking_module_1 = require("../booking/booking.module");
const kafka_module_1 = require("../kafka/kafka.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment]),
            config_1.ConfigModule,
            booking_module_1.BookingModule,
            kafka_module_1.KafkaModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, paystack_service_1.PaystackService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map