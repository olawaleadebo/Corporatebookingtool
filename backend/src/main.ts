import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  // Security - Helmet with relaxed CSP for development
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development (ngrok compatibility)
    crossOriginEmbedderPolicy: false,
  }));

  // CORS - Allow all origins including Figma Make domains
  app.enableCors({
    origin: (origin, callback) => {
      // Log all incoming origins for debugging
      console.log(`🌍 CORS request from origin: ${origin || 'no-origin'}`);
      // Allow all origins (including ngrok and Figma Make proxies)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'User-Agent', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

const port = configService.get<number>('PORT') || 3000;
const host = configService.get<string>('HOST') || '0.0.0.0';

await app.listen(port, host); 
  

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
