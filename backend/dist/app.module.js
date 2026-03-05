"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const search_module_1 = require("./modules/search/search.module");
const booking_module_1 = require("./modules/booking/booking.module");
const payment_module_1 = require("./modules/payment/payment.module");
const notification_module_1 = require("./modules/notification/notification.module");
const policy_module_1 = require("./modules/policy/policy.module");
const kafka_module_1 = require("./modules/kafka/kafka.module");
const websocket_module_1 = require("./modules/websocket/websocket.module");
const health_module_1 = require("./modules/health/health.module");
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context, trace }) => {
                            return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
                        })),
                    }),
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                    new winston.transports.File({
                        filename: 'logs/combined.log',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    ssl: false,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            search_module_1.SearchModule,
            booking_module_1.BookingModule,
            payment_module_1.PaymentModule,
            notification_module_1.NotificationModule,
            policy_module_1.PolicyModule,
            kafka_module_1.KafkaModule,
            websocket_module_1.WebsocketModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map