"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
let WebsocketGateway = class WebsocketGateway {
    constructor(logger) {
        this.logger = logger;
        this.connectedClients = new Map();
    }
    handleConnection(client) {
        this.logger.info('WebSocket client connected', {
            context: 'WebsocketGateway',
            socketId: client.id,
        });
    }
    handleDisconnect(client) {
        const userId = this.connectedClients.get(client.id);
        this.connectedClients.delete(client.id);
        this.logger.info('WebSocket client disconnected', {
            context: 'WebsocketGateway',
            socketId: client.id,
            userId,
        });
    }
    handleAuthentication(client, data) {
        this.connectedClients.set(client.id, data.userId);
        client.join(`user:${data.userId}`);
        this.logger.info('WebSocket client authenticated', {
            context: 'WebsocketGateway',
            socketId: client.id,
            userId: data.userId,
        });
        return { success: true };
    }
    emitBookingUpdate(userId, booking) {
        this.server.to(`user:${userId}`).emit('booking:updated', booking);
        this.logger.info('Booking update emitted', {
            context: 'WebsocketGateway',
            userId,
            bookingId: booking.id,
        });
    }
    emitPaymentUpdate(userId, payment) {
        this.server.to(`user:${userId}`).emit('payment:updated', payment);
        this.logger.info('Payment update emitted', {
            context: 'WebsocketGateway',
            userId,
            paymentId: payment.id,
        });
    }
    emitNotification(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification', notification);
        this.logger.info('Notification emitted', {
            context: 'WebsocketGateway',
            userId,
        });
    }
    broadcast(event, data) {
        this.server.emit(event, data);
        this.logger.info('Broadcast message sent', {
            context: 'WebsocketGateway',
            event,
        });
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleAuthentication", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/',
    }),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [winston_1.Logger])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map