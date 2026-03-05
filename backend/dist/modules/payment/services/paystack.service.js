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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const axios_1 = __importDefault(require("axios"));
let PaystackService = class PaystackService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.baseUrl = 'https://api.paystack.co';
        this.secretKey = this.configService.get('PAYSTACK_SECRET_KEY') || '';
    }
    async initializeTransaction(params) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, params, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.info('Payment initialized', {
                context: 'PaystackService',
                reference: params.reference,
            });
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Payment initialization failed', {
                context: 'PaystackService',
                error: error.response?.data || error.message,
            });
            throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
        }
    }
    async verifyTransaction(reference) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            this.logger.info('Payment verified', {
                context: 'PaystackService',
                reference,
                status: response.data.data.status,
            });
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Payment verification failed', {
                context: 'PaystackService',
                error: error.response?.data || error.message,
                reference,
            });
            throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
        }
    }
    async chargeCard(params) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/charge`, params, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Card charge failed', {
                context: 'PaystackService',
                error: error.response?.data || error.message,
            });
            throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
        }
    }
    async initiateBankTransfer(params) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/charge`, {
                ...params,
                bank: {
                    code: '057',
                    account_number: '0000000000',
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Bank transfer initiation failed', {
                context: 'PaystackService',
                error: error.response?.data || error.message,
            });
            throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
        }
    }
    async refundTransaction(reference) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/refund`, { transaction: reference }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.info('Payment refunded', {
                context: 'PaystackService',
                reference,
            });
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Payment refund failed', {
                context: 'PaystackService',
                error: error.response?.data || error.message,
                reference,
            });
            throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
        }
    }
    verifyWebhookSignature(payload, signature) {
        const crypto = require('crypto');
        const hash = crypto
            .createHmac('sha512', this.configService.get('PAYSTACK_WEBHOOK_SECRET'))
            .update(payload)
            .digest('hex');
        return hash === signature;
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winston_1.Logger])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map