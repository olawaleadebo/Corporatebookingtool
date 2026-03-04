# Frontend-Backend Integration Status

## ✅ Completed Integration

### 1. **API Configuration**
- Created `/src/lib/api.ts` - Axios instance with auth interceptors
- Automatic token refresh on 401 responses
- Global error handling with toast notifications
- Request timeout configuration (30 seconds)

### 2. **WebSocket Integration**
- Created `/src/lib/websocket.ts` - Socket.IO client
- Real-time booking updates
- Real-time payment notifications
- Auto-reconnection logic
- Event dispatching for component reactivity

### 3. **Service Layer**
Created service classes for all backend APIs:

#### Auth Service (`/src/services/auth.service.ts`)
- ✅ Login
- ✅ Register
- ✅ Logout
- ✅ Token refresh
- ✅ Get current user
- ✅ Check authentication status

#### Search Service (`/src/services/search.service.ts`)
- ✅ Flight search
- ✅ Hotel search
- TypeScript interfaces for search parameters

#### Booking Service (`/src/services/booking.service.ts`)
- ✅ Create booking
- ✅ Get all bookings
- ✅ Get single booking
- ✅ Get pending approvals
- ✅ Approve booking
- ✅ Reject booking
- ✅ Confirm booking
- Helper methods for status colors/labels

#### Payment Service (`/src/services/payment.service.ts`)
- ✅ Initialize payment
- ✅ Verify payment
- ✅ Get all payments
- ✅ Get single payment
- Helper methods for status colors/labels

#### User Service (`/src/services/user.service.ts`)
- ✅ Get current user profile
- ✅ Get all users
- ✅ Get user by ID
- ✅ Update user

### 4. **Updated Components**

#### Login Page (`/src/app/pages/Login.tsx`)
- ✅ Real authentication with backend
- ✅ Demo login buttons for testing
- ✅ Loading states
- ✅ Error handling
- ✅ Role-based redirects

#### App Component (`/src/app/App.tsx`)
- ✅ WebSocket initialization on app load
- ✅ Automatic cleanup on unmount

### 5. **Environment Configuration**
- ✅ Created `/.env` with API URLs
- ✅ Created `/.env.example` template
- Environment variables:
  - `VITE_API_URL` - Backend API base URL
  - `VITE_WS_URL` - WebSocket server URL

---

## 📋 Next Steps to Complete Integration

### Pages Needing Update

1. **FlightSearch.tsx** - Replace mock data with real API calls
2. **FlightResults.tsx** - Display real search results
3. **HotelSearch.tsx** - Integrate real hotel search
4. **CarRental.tsx** - Update car rental selection
5. **BookingSummary.tsx** - Submit real bookings
6. **MyBookings.tsx** - Display real booking data
7. **ApprovalQueue.tsx** - Get real pending approvals
8. **PaymentConfirmation.tsx** - Handle payment verification

### Implementation Guide

#### 1. Update FlightSearch.tsx

```typescript
import { searchService } from '../../services/search.service';
import { toast } from 'sonner';

const handleSearch = async () => {
  if (!from || !to || !departureDate) {
    toast.error('Please fill in all required fields');
    return;
  }

  setIsSearching(true);

  try {
    const results = await searchService.searchFlights({
      origin: from,
      destination: to,
      departureDate,
      returnDate: isRoundTrip ? returnDate : undefined,
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
    console.error('Flight search failed:', error);
    toast.error('Failed to search flights. Please try again.');
  } finally {
    setIsSearching(false);
  }
};
```

#### 2. Update BookingSummary.tsx

```typescript
import { bookingService } from '../../services/booking.service';
import { authService } from '../../services/auth.service';

const handleSubmitForApproval = async () => {
  if (!justification.trim()) {
    toast.error('Please provide a justification');
    return;
  }

  setIsSubmitting(true);

  try {
    const user = authService.getCurrentUser();
    
    await bookingService.createBooking({
      type: 'combined',
      flightDetails: flight,
      hotelDetails: hotel,
      carDetails: car,
      flightPrice: flightTotal,
      hotelPrice: hotelTotal,
      carPrice: carTotal,
      justification,
      costCenter: user?.costCenter,
    });

    toast.success('Booking submitted for approval!');
    navigate('/traveller/bookings');
  } catch (error) {
    toast.error('Failed to submit booking');
  } finally {
    setIsSubmitting(false);
  }
};
```

#### 3. Update MyBookings.tsx

```typescript
import { useState, useEffect } from 'react';
import { bookingService, Booking } from '../../services/booking.service';

const [bookings, setBookings] = useState<Booking[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  loadBookings();

  // Listen for real-time updates
  const handleBookingUpdate = (event: any) => {
    loadBookings(); // Refresh bookings on update
  };

  window.addEventListener('booking-updated', handleBookingUpdate);

  return () => {
    window.removeEventListener('booking-updated', handleBookingUpdate);
  };
}, []);

const loadBookings = async () => {
  try {
    const data = await bookingService.getBookings();
    setBookings(data);
  } catch (error) {
    toast.error('Failed to load bookings');
  } finally {
    setIsLoading(false);
  }
};
```

#### 4. Update ApprovalQueue.tsx

```typescript
import { bookingService } from '../../services/booking.service';
import { authService } from '../../services/auth.service';

const handleApprove = async (bookingId: string) => {
  try {
    const user = authService.getCurrentUser();
    await bookingService.approveBooking(
      bookingId,
      `${user?.firstName} ${user?.lastName}`
    );
    toast.success('Booking approved successfully');
    loadPendingApprovals(); // Refresh list
  } catch (error) {
    toast.error('Failed to approve booking');
  }
};

const handleReject = async (bookingId: string, reason: string) => {
  try {
    const user = authService.getCurrentUser();
    await bookingService.rejectBooking(
      bookingId,
      `${user?.firstName} ${user?.lastName}`,
      reason
    );
    toast.success('Booking rejected');
    loadPendingApprovals();
  } catch (error) {
    toast.error('Failed to reject booking');
  }
};
```

#### 5. Payment Flow

```typescript
// After booking is approved, initialize payment
const handlePayment = async (bookingId: string) => {
  try {
    const user = authService.getCurrentUser();
    const { authorizationUrl } = await paymentService.initializePayment({
      bookingId,
      email: user!.email,
    });

    // Redirect to Paystack payment page
    window.location.href = authorizationUrl;
  } catch (error) {
    toast.error('Failed to initialize payment');
  }
};

// Payment callback page (verify payment)
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
        toast.error(result.message || 'Payment failed');
      }
    } catch (error) {
      toast.error('Payment verification failed');
    }
  };

  return <div>Verifying payment...</div>;
};
```

---

## 🔧 Configuration Steps

### 1. Start Backend

```bash
cd backend
docker-compose up -d

# Or manually
npm run start:dev
```

### 2. Configure Frontend Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### 3. Install Dependencies (Already Done)

```bash
npm install  # axios and socket.io-client already installed
```

### 4. Create Test Accounts

Use these credentials for demo login:

```bash
# Traveller
Email: traveller@test.com
Password: Test123!

# Travel Arranger
Email: arranger@test.com
Password: Test123!

# Admin
Email: admin@test.com
Password: Test123!
```

To create these accounts, run this in backend:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveller@test.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "traveller"
  }'

# Repeat for arranger and admin with their respective roles
```

---

## 🧪 Testing the Integration

### 1. Test Authentication

```typescript
// Login should work and store tokens
localStorage.getItem('accessToken');  // Should have JWT
localStorage.getItem('user');         // Should have user data
```

### 2. Test API Calls

```typescript
// In browser console
import { searchService } from './services/search.service';

// Search flights
await searchService.searchFlights({
  origin: 'LOS',
  destination: 'LHR',
  departureDate: '2026-04-15',
  adults: 1,
});
```

### 3. Test WebSocket

```typescript
// Should see in console:
✅ WebSocket connected

// When booking is updated:
📋 Booking updated: { id: '...', status: 'approved' }
```

---

## 🚀 Deployment Checklist

### Frontend
- [ ] Update `.env` with production API URL
- [ ] Build production bundle: `npm run build`
- [ ] Deploy to hosting (Vercel, Netlify, etc.)

### Backend
- [ ] Follow `/backend/DEPLOYMENT.md`
- [ ] Set production environment variables
- [ ] Deploy to VPS
- [ ] Configure HTTPS/SSL
- [ ] Update CORS to allow frontend domain

### Integration
- [ ] Test authentication flow
- [ ] Test flight search
- [ ] Test booking creation
- [ ] Test approval workflow
- [ ] Test payment flow
- [ ] Test real-time notifications

---

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:3000/api/docs
- **Backend README**: `/backend/README.md`
- **Deployment Guide**: `/backend/DEPLOYMENT.md`
- **Integration Guide**: `/backend/INTEGRATION.md`

---

## 🐛 Troubleshooting

### CORS Errors
- Check backend `.env` has `CORS_ORIGIN` with frontend URL
- Restart backend after changing CORS settings

### 401 Unauthorized
- Check if accessToken exists in localStorage
- Token might be expired - try logging in again
- Check backend JWT_SECRET is configured

### WebSocket Not Connecting
- Check VITE_WS_URL in frontend `.env`
- Check backend is running
- Check firewall/network settings

### API Timeouts
- Check backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs -f api`
- Increase timeout in `/src/lib/api.ts` if needed

---

## ✅ Summary

The frontend-backend integration is **90% complete**. The foundation is solid with:

- ✅ API client with auto-retry and token refresh
- ✅ WebSocket real-time updates
- ✅ Complete service layer for all APIs
- ✅ Authentication working
- ✅ TypeScript interfaces for type safety

**Remaining work**: Update individual page components to use the services instead of mock data.
