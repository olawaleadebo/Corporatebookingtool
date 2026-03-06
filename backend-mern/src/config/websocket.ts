import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

// Global WebSocket instance
let io: SocketIOServer | null = null;

export const setWebSocketInstance = (socketServer: SocketIOServer): void => {
  io = socketServer;
  logger.info('WebSocket instance initialized', {
    context: 'WebSocket',
  });
};

export const getWebSocketInstance = (): SocketIOServer | null => {
  return io;
};

/**
 * Emit booking update to specific user
 */
export const emitBookingUpdate = (userId: string, data: any): void => {
  if (!io) {
    logger.warn('WebSocket instance not initialized', {
      context: 'WebSocket',
    });
    return;
  }

  io.to(`user:${userId}`).emit('booking:updated', data);
  logger.debug('Booking update emitted', {
    context: 'WebSocket',
    userId,
    data,
  });
};

/**
 * Emit payment update to specific user
 */
export const emitPaymentUpdate = (userId: string, data: any): void => {
  if (!io) {
    logger.warn('WebSocket instance not initialized', {
      context: 'WebSocket',
    });
    return;
  }

  io.to(`user:${userId}`).emit('payment:updated', data);
  logger.debug('Payment update emitted', {
    context: 'WebSocket',
    userId,
    data,
  });
};

/**
 * Emit notification to specific user
 */
export const emitNotification = (userId: string, data: any): void => {
  if (!io) {
    logger.warn('WebSocket instance not initialized', {
      context: 'WebSocket',
    });
    return;
  }

  io.to(`user:${userId}`).emit('notification', data);
  logger.debug('Notification emitted', {
    context: 'WebSocket',
    userId,
    data,
  });
};
