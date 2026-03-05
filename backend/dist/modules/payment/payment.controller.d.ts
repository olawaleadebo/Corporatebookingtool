import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initializePayment(req: any, body: {
        bookingId: string;
        email: string;
    }): Promise<{
        paymentId: string;
        reference: string;
        authorizationUrl: string;
        accessCode: string;
    }>;
    verifyPayment(reference: string): Promise<{
        success: boolean;
        payment: import("./entities/payment.entity").Payment;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        payment?: undefined;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    findAll(req: any): Promise<import("./entities/payment.entity").Payment[]>;
    findOne(id: string): Promise<import("./entities/payment.entity").Payment>;
}
