import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export interface BookingUpdate {
  id: string;
  status: string;
  [key: string]: any;
}

export interface PaymentUpdate {
  id: string;
  status: string;
  [key: string]: any;
}

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  [key: string]: any;
}

export const connectWebSocket = (userId: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
    // Authenticate the socket connection
    socket?.emit('authenticate', { userId });
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  socket.on('booking:updated', (data: BookingUpdate) => {
    console.log('📋 Booking updated:', data);
    
    // Show notification based on status
    const statusMessages: Record<string, string> = {
      approved: 'Your booking has been approved!',
      rejected: 'Your booking has been rejected',
      confirmed: 'Your booking has been confirmed!',
      failed: 'Booking confirmation failed',
    };

    const message = statusMessages[data.status];
    if (message) {
      const toastType = ['approved', 'confirmed'].includes(data.status) ? 'success' : 'error';
      toast[toastType](message);
    }

    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('booking-updated', { detail: data }));
  });

  socket.on('payment:updated', (data: PaymentUpdate) => {
    console.log('💳 Payment updated:', data);
    
    if (data.status === 'success') {
      toast.success('Payment successful!');
    } else if (data.status === 'failed') {
      toast.error('Payment failed');
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('payment-updated', { detail: data }));
  });

  socket.on('notification', (data: Notification) => {
    console.log('🔔 Notification:', data);
    
    const toastType = data.type || 'info';
    toast[toastType](data.message);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('notification-received', { detail: data }));
  });

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('WebSocket disconnected');
  }
};

export const getWebSocket = () => socket;
