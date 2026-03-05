import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    server: Server;
    private connectedClients;
    constructor(logger: Logger);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAuthentication(client: Socket, data: {
        userId: string;
    }): {
        success: boolean;
    };
    emitBookingUpdate(userId: string, booking: any): void;
    emitPaymentUpdate(userId: string, payment: any): void;
    emitNotification(userId: string, notification: any): void;
    broadcast(event: string, data: any): void;
}
