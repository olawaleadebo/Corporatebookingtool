import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) 
  // {
    
  //   this.secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
  // }
   {
  this.secretKey =
    this.configService.getOrThrow<string>('PAYSTACK_SECRET_KEY');
}

  async initializeTransaction(params: {
    email: string;
    amount: number; // In kobo (smallest currency unit)
    reference: string;
    callback_url?: string;
    metadata?: any;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        params,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.info('Payment initialized', {
        context: 'PaystackService',
        reference: params.reference,
      });

      return response.data.data;
    } catch (error) {
      this.logger.error('Payment initialization failed', {
        context: 'PaystackService',
        error: error.response?.data || error.message,
      });
      throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      this.logger.info('Payment verified', {
        context: 'PaystackService',
        reference,
        status: response.data.data.status,
      });

      return response.data.data;
    } catch (error) {
      this.logger.error('Payment verification failed', {
        context: 'PaystackService',
        error: error.response?.data || error.message,
        reference,
      });
      throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async chargeCard(params: {
    email: string;
    amount: number;
    card: {
      number: string;
      cvv: string;
      expiry_month: string;
      expiry_year: string;
    };
    pin?: string;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/charge`,
        params,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data;
    } catch (error) {
      this.logger.error('Card charge failed', {
        context: 'PaystackService',
        error: error.response?.data || error.message,
      });
      throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async initiateBankTransfer(params: {
    email: string;
    amount: number;
    reference: string;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/charge`,
        {
          ...params,
          bank: {
            code: '057',
            account_number: '0000000000',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data;
    } catch (error) {
      this.logger.error('Bank transfer initiation failed', {
        context: 'PaystackService',
        error: error.response?.data || error.message,
      });
      throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async refundTransaction(reference: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/refund`,
        { transaction: reference },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.info('Payment refunded', {
        context: 'PaystackService',
        reference,
      });

      return response.data.data;
    } catch (error) {
      this.logger.error('Payment refund failed', {
        context: 'PaystackService',
        error: error.response?.data || error.message,
        reference,
      });
      throw new Error(`Paystack API error: ${error.response?.data?.message || error.message}`);
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', this.configService.get('PAYSTACK_WEBHOOK_SECRET'))
      .update(payload)
      .digest('hex');
    
    return hash === signature;
  }
}
