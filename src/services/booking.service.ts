import api from '../lib/api';

export interface CreateBookingData {
  type: 'flight' | 'hotel' | 'car' | 'combined';
  flightDetails?: any;
  hotelDetails?: any;
  carDetails?: any;
  flightPrice: number;
  hotelPrice?: number;
  carPrice?: number;
  justification: string;
  costCenter?: string;
  projectCode?: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  type: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'confirmed' | 'cancelled' | 'completed' | 'failed';
  flightDetails?: any;
  hotelDetails?: any;
  carDetails?: any;
  flightPrice: number;
  hotelPrice: number;
  carPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  justification: string;
  costCenter?: string;
  projectCode?: string;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: any;
}

class BookingService {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  }

  async getBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  }

  async getBooking(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  }

  async getPendingApprovals(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings/pending');
    return response.data;
  }

  async approveBooking(id: string, approverName: string): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/approve`, {
      approverName,
    });
    return response.data;
  }

  async rejectBooking(id: string, approverName: string, reason: string): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/reject`, {
      approverName,
      reason,
    });
    return response.data;
  }

  async confirmBooking(id: string): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/confirm`);
    return response.data;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      confirmed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-purple-100 text-purple-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      rejected: 'Rejected',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      failed: 'Failed',
    };
    return labels[status] || status;
  }
}

export const bookingService = new BookingService();
