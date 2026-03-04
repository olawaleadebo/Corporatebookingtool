import api from '../lib/api';

export interface InitializePaymentData {
  bookingId: string;
  email: string;
}

export interface PaymentInitResponse {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  payment?: Payment;
  message?: string;
}

export interface Payment {
  id: string;
  reference: string;
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded' | 'cancelled';
  method: 'card' | 'bank_transfer' | 'ussd' | 'mobile_money';
  paystackReference: string;
  authorizationUrl?: string;
  accessCode?: string;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

class PaymentService {
  async initializePayment(data: InitializePaymentData): Promise<PaymentInitResponse> {
    const response = await api.post<PaymentInitResponse>('/payments/initialize', data);
    return response.data;
  }

  async verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    const response = await api.get<PaymentVerifyResponse>(`/payments/verify/${reference}`);
    return response.data;
  }

  async getPayments(): Promise<Payment[]> {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      success: 'Success',
      failed: 'Failed',
      refunded: 'Refunded',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }
}

export const paymentService = new PaymentService();
