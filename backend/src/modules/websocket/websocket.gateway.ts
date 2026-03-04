import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>(); // socketId -> userId

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.info('WebSocket client connected', {
      context: 'WebsocketGateway',
      socketId: client.id,
    });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = this.connectedClients.get(client.id);
    this.connectedClients.delete(client.id);
    
    this.logger.info('WebSocket client disconnected', {
      context: 'WebsocketGateway',
      socketId: client.id,
      userId,
    });
  }

  @SubscribeMessage('authenticate')
  handleAuthentication(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    this.connectedClients.set(client.id, data.userId);
    client.join(`user:${data.userId}`);
    
    this.logger.info('WebSocket client authenticated', {
      context: 'WebsocketGateway',
      socketId: client.id,
      userId: data.userId,
    });

    return { success: true };
  }

  // Emit booking update to specific user
  emitBookingUpdate(userId: string, booking: any) {
    this.server.to(`user:${userId}`).emit('booking:updated', booking);
    
    this.logger.info('Booking update emitted', {
      context: 'WebsocketGateway',
      userId,
      bookingId: booking.id,
    });
  }

  // Emit payment update to specific user
  emitPaymentUpdate(userId: string, payment: any) {
    this.server.to(`user:${userId}`).emit('payment:updated', payment);
    
    this.logger.info('Payment update emitted', {
      context: 'WebsocketGateway',
      userId,
      paymentId: payment.id,
    });
  }

  // Emit notification to specific user
  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    
    this.logger.info('Notification emitted', {
      context: 'WebsocketGateway',
      userId,
    });
  }

  // Broadcast to all connected clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
    
    this.logger.info('Broadcast message sent', {
      context: 'WebsocketGateway',
      event,
    });
  }
}
