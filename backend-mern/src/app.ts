import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import authRoutes from './routes/auth.routes';
import searchRoutes from './routes/search.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';
import { logger } from './utils/logger';
import { setWebSocketInstance } from './config/websocket';

export class App {
  public app: Application;
  public httpServer: HTTPServer;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    
    // WebSocket CORS origins - support both local and ngrok
    const wsOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      process.env.WEBSOCKET_ORIGIN || 'http://localhost:5173',
      process.env.NGROK_URL || '',
    ].filter(Boolean);

    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: wsOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet());
    
    // CORS - support multiple origins including ngrok
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      process.env.NGROK_URL || '',
      'http://localhost:3000',
      'http://localhost:5173',
    ].filter(Boolean);

    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Request logging
    this.app.use(requestLogger);

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: 'Too many requests from this IP, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);
  }

  private initializeRoutes(): void {
    const apiVersion = process.env.API_VERSION || 'v1';

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use(`/api/${apiVersion}/auth`, authRoutes);
    this.app.use(`/api/${apiVersion}/search`, searchRoutes);
    this.app.use(`/api/${apiVersion}/bookings`, bookingRoutes);
    this.app.use(`/api/${apiVersion}/payments`, paymentRoutes);

    // Welcome route
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Welcome to COBT Backend API - MERN Stack',
        version: apiVersion,
        documentation: '/api/docs',
      });
    });
  }

  private initializeWebSocket(): void {
    this.io.on('connection', (socket) => {
      logger.info('WebSocket client connected', {
        context: 'WebSocket',
        socketId: socket.id,
      });

      // Join user room
      socket.on('join', (userId: string) => {
        socket.join(`user:${userId}`);
        logger.info('User joined room', {
          context: 'WebSocket',
          userId,
          socketId: socket.id,
        });
      });

      // Booking updates
      socket.on('booking:update', (data) => {
        this.io.to(`user:${data.userId}`).emit('booking:updated', data);
      });

      // Payment updates
      socket.on('payment:update', (data) => {
        this.io.to(`user:${data.userId}`).emit('payment:updated', data);
      });

      socket.on('disconnect', () => {
        logger.info('WebSocket client disconnected', {
          context: 'WebSocket',
          socketId: socket.id,
        });
      });
    });

    // Set the WebSocket instance for other modules to use
    setWebSocketInstance(this.io);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(port: number): void {
    this.httpServer.listen(port, () => {
      logger.info(`Server is running on port ${port}`, {
        context: 'Server',
        port,
        environment: process.env.NODE_ENV || 'development',
      });
    });
  }
}