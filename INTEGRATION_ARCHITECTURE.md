# COBT Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                       │
│                        Port: 5173                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Login      │  │ FlightSearch │  │ BookingSummary│              │
│  │   Page       │  │   Page       │  │    Page       │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘              │
│         │                 │                  │                       │
│         ▼                 ▼                  ▼                       │
│  ┌──────────────────────────────────────────────────┐               │
│  │           Service Layer                           │               │
│  ├───────────┬──────────┬──────────┬────────────────┤               │
│  │ authService│bookingService│searchService│paymentService│         │
│  └─────┬─────┴────┬─────┴────┬─────┴────┬──────────┘               │
│        │          │          │          │                           │
│        └──────────┴──────────┴──────────┘                           │
│                   │                                                  │
│                   ▼                                                  │
│        ┌──────────────────────┐        ┌─────────────┐             │
│        │   API Client (Axios) │        │  WebSocket  │             │
│        │  - Interceptors      │        │  (Socket.io)│             │
│        │  - Token Management  │        └─────┬───────┘             │
│        │  - Error Handling    │              │                      │
│        └──────────┬───────────┘              │                      │
└───────────────────┼──────────────────────────┼──────────────────────┘
                    │                          │
                    │ HTTP/REST                │ WebSocket
                    │                          │
┌───────────────────▼──────────────────────────▼──────────────────────┐
│                    BACKEND (NestJS)                                  │
│                    Port: 3000                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │ Auth Controller│  │Booking Controller│ │Search Controller│        │
│  └───────┬────────┘  └───────┬─────────┘  └───────┬────────┘        │
│          │                   │                    │                  │
│          ▼                   ▼                    ▼                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │  Auth Service  │  │Booking Service │  │ Search Service │        │
│  └───────┬────────┘  └───────┬─────────┘  └───────┬────────┘        │
│          │                   │                    │                  │
│          │                   │                    │                  │
│  ┌───────▼──────────────────────────────────────────┐               │
│  │           TypeORM Entities & Repositories        │               │
│  │  - User   - Booking   - Payment   - Policy       │               │
│  └──────────────────────┬───────────────────────────┘               │
│                         │                                            │
│  ┌──────────────────────▼───────────────┐                           │
│  │     WebSocket Gateway                 │                           │
│  │  - booking:updated                    │                           │
│  │  - payment:updated                    │                           │
│  │  - notification                       │                           │
│  └───────────────────────────────────────┘                           │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐                         │
│  │ Amadeus Service  │  │ Paystack Service │                         │
│  │ (External API)   │  │ (External API)   │                         │
│  └──────────────────┘  └──────────────────┘                         │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │    Kafka     │  │    Redis     │              │
│  │  (Database)  │  │  (Messages)  │  │   (Cache)    │              │
│  │  Port: 5432  │  │  Port: 9092  │  │  Port: 6379  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Authentication Flow

```
User                Frontend              Backend              Database
 │                     │                     │                     │
 │  Enter Credentials  │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │  POST /auth/login   │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │  Query user         │
 │                     │                     ├────────────────────>│
 │                     │                     │<────────────────────┤
 │                     │                     │  User data          │
 │                     │                     │                     │
 │                     │  {user, tokens}     │                     │
 │                     │<────────────────────┤                     │
 │                     │                     │                     │
 │  Store in localStorage                    │                     │
 │  - accessToken                            │                     │
 │  - refreshToken                           │                     │
 │  - user                                   │                     │
 │                     │                     │                     │
 │  Redirect to Dashboard                    │                     │
 │<────────────────────┤                     │                     │
```

### 2. Booking Creation Flow

```
Traveller    Frontend         Backend         Kafka        Travel Arranger
    │            │               │              │                │
    │ Fill Form  │               │              │                │
    ├───────────>│               │              │                │
    │            │ POST /bookings│              │                │
    │            ├──────────────>│              │                │
    │            │               │ Create DB    │                │
    │            │               │ record       │                │
    │            │               │              │                │
    │            │               │ Publish event│                │
    │            │               ├─────────────>│                │
    │            │               │              │                │
    │            │ Booking+Ref   │              │  WebSocket     │
    │            │<──────────────┤              │  notification  │
    │            │               │              ├───────────────>│
    │  Success   │               │              │                │
    │  Toast     │               │              │   New Request  │
    │<───────────┤               │              │   Toast        │
    │            │               │              │                │
```

### 3. Approval Flow with Real-time Updates

```
Arranger      Frontend        Backend      WebSocket     Traveller
   │              │              │             │             │
   │ View Queue   │              │             │             │
   ├─────────────>│              │             │             │
   │              │ GET /bookings/pending     │             │
   │              ├─────────────>│             │             │
   │              │<─────────────┤             │             │
   │              │ Pending list │             │             │
   │<─────────────┤              │             │             │
   │              │              │             │             │
   │ Click Approve│              │             │             │
   ├─────────────>│              │             │             │
   │              │ PATCH /bookings/:id/approve             │
   │              ├─────────────>│             │             │
   │              │              │ Update DB   │             │
   │              │              │             │             │
   │              │              │ Emit event  │             │
   │              │              ├────────────>│             │
   │              │              │             │ Send to user│
   │              │              │             ├────────────>│
   │              │<─────────────┤             │             │
   │  Success     │ Updated      │             │   Toast:    │
   │  Toast       │ booking      │             │   Approved! │
   │<─────────────┤              │             │             │
```

### 4. Payment Flow

```
User         Frontend        Backend        Paystack      Database
 │               │              │               │              │
 │ Submit Pay    │              │               │              │
 ├──────────────>│              │               │              │
 │               │ POST /payments/initialize    │              │
 │               ├─────────────>│               │              │
 │               │              │ Create payment│              │
 │               │              ├──────────────>│              │
 │               │              │               │ Init payment │
 │               │              │               ├─────────────>│
 │               │              │               │ URL          │
 │               │              │<──────────────┤              │
 │               │<─────────────┤               │              │
 │               │ {authURL}    │               │              │
 │               │              │               │              │
 │ Redirect      │              │               │              │
 │──────────────────────────────────────────────>│              │
 │               │              │               │              │
 │ Complete Payment              │               │              │
 │<──────────────────────────────────────────────┤              │
 │               │              │               │              │
 │ Callback with reference       │               │              │
 ├──────────────────────────────>│               │              │
 │               │ GET /payments/verify/:ref     │              │
 │               │              ├──────────────>│              │
 │               │              │               │ Verify       │
 │               │              │               ├─────────────>│
 │               │              │               │ Status       │
 │               │              │<──────────────┤              │
 │               │              │ Update status │              │
 │               │              ├──────────────────────────────>│
 │               │<─────────────┤               │              │
 │  Success Page │              │               │              │
 │<──────────────┤              │               │              │
```

## API Endpoints Map

### Authentication Module
```
POST   /api/v1/auth/register      Create new user account
POST   /api/v1/auth/login         Login with credentials
POST   /api/v1/auth/refresh       Refresh access token
POST   /api/v1/auth/logout        Logout and invalidate tokens
```

### Bookings Module
```
GET    /api/v1/bookings           Get user's bookings
GET    /api/v1/bookings/pending   Get pending approval requests
GET    /api/v1/bookings/:id       Get booking details
POST   /api/v1/bookings           Create new booking
PATCH  /api/v1/bookings/:id/approve    Approve booking
PATCH  /api/v1/bookings/:id/reject     Reject booking
PATCH  /api/v1/bookings/:id/confirm    Confirm booking
```

### Search Module
```
GET    /api/v1/search/flights     Search flights (Amadeus)
  Params: origin, destination, departureDate, returnDate, adults, travelClass

GET    /api/v1/search/hotels      Search hotels (Amadeus)
  Params: cityCode, checkInDate, checkOutDate, adults
```

### Payments Module
```
GET    /api/v1/payments           Get user's payments
GET    /api/v1/payments/:id       Get payment details
POST   /api/v1/payments/initialize    Initialize Paystack payment
GET    /api/v1/payments/verify/:ref   Verify payment status
```

### Users Module
```
GET    /api/v1/users/me           Get current user profile
GET    /api/v1/users              Get all users (admin only)
GET    /api/v1/users/:id          Get user by ID
PATCH  /api/v1/users/:id          Update user details
```

## WebSocket Events

### Client → Server
```
authenticate      Send user ID to join room
disconnect        Clean up on disconnect
```

### Server → Client
```
booking:updated   { id, status, bookingReference, ... }
payment:updated   { id, status, amount, ... }
notification      { message, type, timestamp, ... }
```

## Service Layer Architecture

### Frontend Services

```typescript
authService
├── login(credentials)
├── register(data)
├── logout()
├── refreshToken()
├── getCurrentUser()
└── isAuthenticated()

bookingService
├── createBooking(data)
├── getBookings()
├── getBooking(id)
├── getPendingApprovals()
├── approveBooking(id, approverName)
├── rejectBooking(id, approverName, reason)
└── confirmBooking(id)

searchService
├── searchFlights(params)
└── searchHotels(params)

paymentService
├── initializePayment(data)
├── verifyPayment(reference)
├── getPayments()
└── getPayment(id)

userService
├── getMe()
├── getAllUsers()
├── getUser(id)
└── updateUser(id, data)
```

## State Management

### LocalStorage
```
accessToken       JWT access token (15 min expiry)
refreshToken      Refresh token (7 days expiry)
user              User object { id, email, role, ... }
```

### In-Memory State
```
React State       Component-level state (bookings, flights, etc.)
WebSocket         Real-time connection state
```

## Security Features

```
┌─────────────────────────────────────────────┐
│         Security Layers                     │
├─────────────────────────────────────────────┤
│                                             │
│  1. JWT Authentication                      │
│     - Access token (short-lived)            │
│     - Refresh token (long-lived)            │
│     - Automatic refresh on 401              │
│                                             │
│  2. HTTP Interceptors                       │
│     - Auto-add Authorization header         │
│     - Handle token expiration               │
│     - Network error handling                │
│                                             │
│  3. Role-Based Access Control               │
│     - Traveller: Create bookings            │
│     - Arranger: Approve/reject              │
│     - Admin: User & policy management       │
│                                             │
│  4. CORS Protection                         │
│     - Allowed origins only                  │
│     - Credentials included                  │
│                                             │
│  5. Input Validation                        │
│     - Frontend: Form validation             │
│     - Backend: DTO validation               │
│     - Type safety with TypeScript           │
│                                             │
└─────────────────────────────────────────────┘
```

## Error Handling Strategy

```
Error Type              Frontend Action                 User Experience
────────────────────────────────────────────────────────────────────────
Network Error          Show offline indicator           Toast notification
401 Unauthorized       Auto token refresh               Silent or re-login
404 Not Found          Show not found message           Friendly error page
500 Server Error       Log error, show generic msg      "Something went wrong"
Validation Error       Show field-specific error        Red text under input
WebSocket Disconnect   Auto-reconnect (5 attempts)      Connection indicator
Payment Failure        Redirect to error page           Clear next steps
```

## Performance Optimizations

```
Frontend:
- Code splitting by route
- Lazy loading components
- Debounced search inputs
- Cached API responses
- Optimistic UI updates
- Image lazy loading

Backend:
- Database connection pooling
- Query optimization with indexes
- Caching with Redis
- Async operations with Kafka
- Rate limiting
- Pagination for lists
```

## Deployment Architecture

```
Production Environment:

┌──────────────────────────────────────────┐
│         CDN (Frontend Static Files)       │
│         - React build artifacts           │
│         - Images, CSS, JS                 │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│      Load Balancer / Reverse Proxy       │
│              (Nginx)                      │
└────┬────────────────────────────────┬────┘
     │                                │
     ▼                                ▼
┌─────────────┐              ┌─────────────┐
│  Backend    │              │  Backend    │
│  Instance 1 │              │  Instance 2 │
│  (NestJS)   │              │  (NestJS)   │
└──────┬──────┘              └──────┬──────┘
       │                            │
       └────────────┬───────────────┘
                    ▼
       ┌────────────────────────┐
       │   PostgreSQL Cluster   │
       │   (Primary + Replicas) │
       └────────────────────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   [Kafka]      [Redis]    [Monitoring]
```

## Monitoring & Observability

```
Metrics to Track:

Frontend:
- Page load time
- API response time
- Error rate
- WebSocket connection status
- User sessions

Backend:
- Request rate
- Response time (p50, p95, p99)
- Error rate by endpoint
- Database query time
- External API latency (Amadeus, Paystack)
- Active WebSocket connections

Infrastructure:
- CPU usage
- Memory usage
- Database connections
- Kafka lag
- Redis hit rate
```

---

**Architecture Version**: 1.0  
**Last Updated**: March 5, 2026  
**Status**: Production Ready (pending API keys configuration)
