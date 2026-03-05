import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
export declare class PaystackService {
    private configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly secretKey;
    constructor(configService: ConfigService, logger: Logger);
    initializeTransaction(params: {
        email: string;
        amount: number;
        reference: string;
        callback_url?: string;
        metadata?: any;
    }): Promise<any>;
    verifyTransaction(reference: string): Promise<any>;
    chargeCard(params: {
        email: string;
        amount: number;
        card: {
            number: string;
            cvv: string;
            expiry_month: string;
            expiry_year: string;
        };
        pin?: string;
    }): Promise<any>;
    initiateBankTransfer(params: {
        email: string;
        amount: number;
        reference: string;
    }): Promise<any>;
    refundTransaction(reference: string): Promise<any>;
    verifyWebhookSignature(payload: string, signature: string): boolean;
}
