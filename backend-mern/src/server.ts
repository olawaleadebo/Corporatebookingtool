import dotenv from 'dotenv';
import { App } from './app';
import { connectDatabase } from './config/database';
import { redisClient } from './config/redis';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    context: 'Server',
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection', {
    context: 'Server',
    reason: reason.message || reason,
  });
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize app
    const app = new App();

    // Get port from environment
    const port = parseInt(process.env.PORT || '3001', 10);

    // Start listening
    app.listen(port);

    logger.info('Application started successfully', {
      context: 'Server',
      port,
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error: any) {
    logger.error('Failed to start application', {
      context: 'Server',
      error: error.message,
    });
    process.exit(1);
  }
};

startServer();