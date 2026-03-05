"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.enableCors({
        origin: (origin, callback) => {
            console.log(`🌍 CORS request from origin: ${origin || 'no-origin'}`);
            callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'User-Agent', 'Accept'],
        exposedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('COBT API')
        .setDescription('Corporate Booking Tool API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('search', 'Search flights and hotels')
        .addTag('bookings', 'Booking management')
        .addTag('payments', 'Payment processing')
        .addTag('users', 'User management')
        .addTag('policies', 'Policy management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map