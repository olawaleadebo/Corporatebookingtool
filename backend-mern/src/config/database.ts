import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cobt';
    
    await mongoose.connect(mongoUri);
    
    logger.info('MongoDB connected successfully', {
      context: 'Database',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', {
        context: 'Database',
        error: err.message,
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected', { context: 'Database' });
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination', {
        context: 'Database',
      });
      process.exit(0);
    });
  } catch (error: any) {
    logger.error('MongoDB connection failed', {
      context: 'Database',
      error: error.message,
    });
    process.exit(1);
  }
};
