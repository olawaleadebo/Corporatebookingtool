import axios from 'axios';
import { logger } from '../utils/logger';

export class PaystackService {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    if (!this.secretKey) {
      logger.warn('Paystack secret key not configured', {
        context: 'PaystackService',
      });
    }
  }

  async initializeTransaction(params: {
    email: string;
    amount: number;
    reference: string;
    metadata?: any;
  }): Promise<any> {
    try {
      if (!this.secretKey) {
        logger.info('Mock payment initialization (Paystack not configured)', {
          context: 'PaystackService',
        });
        return {
          status: true,
          data: {
            authorization_url: `https://checkout.paystack.com/mock/${params.reference}`,
            access_code: `mock_access_code_${Date.now()}`,
            reference: params.reference,
          },
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email: params.email,
          amount: Math.round(params.amount * 100), // Convert to kobo
          reference: params.reference,
          currency: 'NGN',
          metadata: params.metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Payment initialized successfully', {
        context: 'PaystackService',
        reference: params.reference,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to initialize payment', {
        context: 'PaystackService',
        error: error.message,
        reference: params.reference,
      });
      throw error;
    }
  }

  async verifyTransaction(reference: string): Promise<any> {
    try {
      if (!this.secretKey) {
        logger.info('Mock payment verification (Paystack not configured)', {
          context: 'PaystackService',
        });
        return {
          status: true,
          data: {
            status: 'success',
            reference,
            amount: 100000,
            currency: 'NGN',
          },
        };
      }

      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      logger.info('Payment verified successfully', {
        context: 'PaystackService',
        reference,
        status: response.data.data.status,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to verify payment', {
        context: 'PaystackService',
        error: error.message,
        reference,
      });
      throw error;
    }
  }

  async refundTransaction(reference: string): Promise<any> {
    try {
      if (!this.secretKey) {
        logger.info('Mock payment refund (Paystack not configured)', {
          context: 'PaystackService',
        });
        return {
          status: true,
          data: {
            status: 'refunded',
            reference,
          },
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/refund`,
        { transaction: reference },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Payment refunded successfully', {
        context: 'PaystackService',
        reference,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to refund payment', {
        context: 'PaystackService',
        error: error.message,
        reference,
      });
      throw error;
    }
  }
}
