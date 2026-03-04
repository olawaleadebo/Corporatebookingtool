# Frontend-Backend Integration Guide

This guide explains how to connect your React frontend to the NestJS backend API.

## Prerequisites

- Backend running on `http://localhost:3000` (or your VPS URL)
- Frontend running on `http://localhost:5173`

---

## API Configuration

### 1. Create API Client (Frontend)

Create `/src/lib/api.ts` in your frontend:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 2. Environment Variables

Create `/frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

For production:
```bash
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_WS_URL=https://api.yourdomain.com
```

---

## API Integration Examples

### Authentication

#### Login
```typescript
// /src/services/auth.service.ts
import { api } from '../lib/api';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, accessToken };
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
```

#### Update Login Component
```typescript
// /src/app/pages/Login.tsx
import { authService } from '../services/auth.service';

const handleLogin = async (email: string, password: string) => {
  try {
    const { user } = await authService.login(email, password);
    
    // Redirect based on role
    if (user.role === 'traveller') {
      navigate('/traveller');
    } else if (user.role === 'travel_arranger') {
      navigate('/arranger');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  } catch (error) {
    console.error('Login failed:', error);
    toast.error('Invalid credentials');
  }
};
```

---

### Flight Search

```typescript
// /src/services/search.service.ts
import { api } from '../lib/api';

export const searchService = {
  async searchFlights(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults?: number;
    travelClass?: string;
  }) {
    const response = await api.get('/search/flights', { params });
    return response.data;
  },

  async searchHotels(params: {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults?: number;
  }) {
    const response = await api.get('/search/hotels', { params });
    return response.data;
  },
};
```

#### Update FlightSearch Component
```typescript
// /src/app/pages/FlightSearch.tsx
import { searchService } from '../services/search.service';

const handleSearch = async () => {
  try {
    setIsSearching(true);
    
    const results = await searchService.searchFlights({
      origin: from,
      destination: to,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: passengers,
      travelClass: tripClass,
    });
    
    navigate('/traveller/flight-results', {
      state: {
        flights: results,
        searchParams: { from, to, departureDate, returnDate, passengers, tripClass },
      },
    });
  } catch (error) {
    console.error('Search failed:', error);
    toast.error('Failed to search flights');
  } finally {
    setIsSearching(false);
  }
};
```

---

### Booking Management

```typescript
// /src/services/booking.service.ts
import { api } from '../lib/api';

export const bookingService = {
  async createBooking(bookingData: {
    type: string;
    flightDetails: any;
    hotelDetails?: any;
    carDetails?: any;
    flightPrice: number;
    hotelPrice?: number;
    carPrice?: number;
    justification: string;
    costCenter?: string;
  }) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  async getBooking(id: string) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async getPendingApprovals() {
    const response = await api.get('/bookings/pending');
    return response.data;
  },

  async approveBooking(id: string, approverName: string) {
    const response = await api.patch(`/bookings/${id}/approve`, { approverName });
    return response.data;
  },

  async rejectBooking(id: string, approverName: string, reason: string) {
    const response = await api.patch(`/bookings/${id}/reject`, {
      approverName,
      reason,
    });
    return response.data;
  },
};
```

#### Update BookingSummary Component
```typescript
// /src/app/pages/BookingSummary.tsx
import { bookingService } from '../services/booking.service';

const handleSubmitForApproval = async () => {
  if (!justification.trim()) {
    toast.error('Please provide a justification for this trip');
    return;
  }

  setIsSubmitting(true);

  try {
    await bookingService.createBooking({
      type: 'combined',
      flightDetails: flight,
      hotelDetails: hotel,
      carDetails: car,
      flightPrice: flightTotal,
      hotelPrice: hotelTotal,
      carPrice: carTotal,
      justification,
      costCenter: 'ENG-001', // Get from user profile
    });

    toast.success('Booking request submitted for approval!');
    
    setTimeout(() => {
      navigate('/traveller/bookings');
    }, 1500);
  } catch (error) {
    console.error('Failed to create booking:', error);
    toast.error('Failed to submit booking');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### Payment Integration

```typescript
// /src/services/payment.service.ts
import { api } from '../lib/api';

export const paymentService = {
  async initializePayment(bookingId: string, email: string) {
    const response = await api.post('/payments/initialize', {
      bookingId,
      email,
    });
    return response.data;
  },

  async verifyPayment(reference: string) {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },

  async getPayments() {
    const response = await api.get('/payments');
    return response.data;
  },
};
```

#### Payment Flow
```typescript
// Initiate payment after booking approval
const handlePayment = async (bookingId: string) => {
  try {
    const user = authService.getCurrentUser();
    const { authorizationUrl, reference } = await paymentService.initializePayment(
      bookingId,
      user.email
    );

    // Redirect to Paystack payment page
    window.location.href = authorizationUrl;
  } catch (error) {
    console.error('Payment initialization failed:', error);
    toast.error('Failed to initialize payment');
  }
};

// Payment callback page
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  const verifyPayment = async (ref: string) => {
    try {
      const result = await paymentService.verifyPayment(ref);
      
      if (result.success) {
        toast.success('Payment successful!');
        navigate('/traveller/bookings');
      } else {
        toast.error('Payment failed');
        navigate('/traveller/bookings');
      }
    } catch (error) {
      toast.error('Payment verification failed');
      navigate('/traveller/bookings');
    }
  };

  return <div>Verifying payment...</div>;
};
```

---

### WebSocket Integration

```typescript
// /src/lib/websocket.ts
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const connectWebSocket = (userId: string) => {
  socket = io(WS_URL);

  socket.on('connect', () => {
    console.log('WebSocket connected');
    socket?.emit('authenticate', { userId });
  });

  socket.on('booking:updated', (data) => {
    console.log('Booking updated:', data);
    // Update UI or show notification
  });

  socket.on('payment:updated', (data) => {
    console.log('Payment updated:', data);
    // Update UI or show notification
  });

  socket.on('notification', (data) => {
    console.log('Notification:', data);
    // Show toast notification
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

#### Use in App Component
```typescript
// /src/app/App.tsx
import { useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from './lib/websocket';
import { authService } from './services/auth.service';

function App() {
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const socket = connectWebSocket(user.id);
      
      return () => {
        disconnectWebSocket();
      };
    }
  }, []);

  return (
    // ... rest of app
  );
}
```

---

## CORS Configuration

Make sure backend `.env` has your frontend URL:

```bash
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
```

---

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user

### Search
- `GET /api/v1/search/flights` - Search flights
- `GET /api/v1/search/hotels` - Search hotels

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/pending` - Get pending approvals
- `GET /api/v1/bookings/:id` - Get booking
- `PATCH /api/v1/bookings/:id/approve` - Approve booking
- `PATCH /api/v1/bookings/:id/reject` - Reject booking
- `PATCH /api/v1/bookings/:id/confirm` - Confirm booking

### Payments
- `POST /api/v1/payments/initialize` - Initialize payment
- `GET /api/v1/payments/verify/:reference` - Verify payment
- `POST /api/v1/payments/webhook` - Paystack webhook
- `GET /api/v1/payments` - Get all payments
- `GET /api/v1/payments/:id` - Get payment

---

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### API Documentation

Access Swagger documentation at:
```
http://localhost:3000/api/docs
```

---

## Error Handling

```typescript
// /src/lib/api.ts - Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      toast.error(message);
    } else if (error.request) {
      // Request made but no response
      toast.error('No response from server');
    } else {
      // Other errors
      toast.error('An error occurred');
    }
    
    return Promise.reject(error);
  }
);
```

---

## Next Steps

1. Install axios and socket.io-client in frontend:
   ```bash
   cd /src
   npm install axios socket.io-client
   ```

2. Create the API service files as shown above

3. Update your components to use the API services

4. Test the integration with backend running

5. Deploy both frontend and backend

---

## Support

For issues:
- Check browser console for errors
- Check backend logs: `docker-compose logs -f api`
- Verify CORS settings
- Check network tab in browser DevTools
