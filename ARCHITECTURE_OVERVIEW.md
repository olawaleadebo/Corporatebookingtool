# BTMTravel COBT - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                   http://localhost:5173                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/WebSocket
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   Traveller  │    Travel    │    Admin     │   Shared     │ │
│  │     Pages    │   Arranger   │    Pages     │  Components  │ │
│  │              │     Pages    │              │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           API Service (Axios) + WebSocket                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API / WebSocket
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                  BACKEND (NestJS)                               │
│              http://localhost:3000                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   API Routes                            │   │
│  │  /auth  /search  /booking  /payment  /health           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐     │
│  │   Auth   │  Search  │ Booking  │ Payment  │  WebSocket│     │
│  │  Module  │  Module  │  Module  │  Module  │  Gateway  │     │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Kafka Producer/Consumer                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────┬──────────┬──────────┬──────────┬──────────┬───────────┘
        │          │          │          │          │
        │          │          │          │          │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌──▼──────┐
    │       │  │       │  │       │  │       │  │         │
    │ Post  │  │ Kafka │  │Amadeus│  │Paystack│ │ Redis  │
    │ greSQL│  │       │  │  API  │  │  API  │  │ (Cache)│
    │       │  │       │  │       │  │       │  │         │
    └───────┘  └───────┘  └───────┘  └───────┘  └─────────┘
```

---

## Component Breakdown

### Frontend (Port 5173)

```
/src
├── app/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── layouts/         # Layout components
│   │   └── BackendOfflineAlert.tsx
│   │
│   └── pages/
│       ├── Login.tsx
│       ├── TravellerDashboard.tsx
│       ├── FlightSearch.tsx
│       ├── FlightResults.tsx
│       ├── HotelSearch.tsx
│       ├── CarRental.tsx
│       ├── BookingSummary.tsx
│       ├── MyBookings.tsx
│       ├── TravelArrangerDashboard.tsx
│       ├── ApprovalQueue.tsx
│       ├── BackendTest.tsx
│       ├── SystemStatus.tsx   # NEW: Health monitoring
│       └── admin/
│           ├── AdminDashboard.tsx
│           ├── PolicyManagement.tsx
│           └── ...
│
├── services/
│   ├── auth.service.ts
│   ├── booking.service.ts
│   ├── search.service.ts
│   ├── payment.service.ts
│   └── user.service.ts
│
└── lib/
    ├── api.ts              # Axios instance + interceptors
    └── websocket.ts        # Socket.io client
```

### Backend (Port 3000)

```
/backend/src
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   └── guards/
│   │
│   ├── search/
│   │   ├── search.controller.ts
│   │   ├── search.service.ts
│   │   └── services/amadeus.service.ts
│   │
│   ├── booking/
│   │   ├── booking.controller.ts
│   │   ├── booking.service.ts
│   │   └── entities/booking.entity.ts
│   │
│   ├── payment/
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   └── services/paystack.service.ts
│   │
│   ├── kafka/
│   │   ├── kafka-producer.service.ts
│   │   └── kafka-consumer.service.ts
│   │
│   ├── websocket/
│   │   └── websocket.gateway.ts
│   │
│   └── health/
│       └── health.controller.ts
│
└── main.ts
```

---

## Data Flow

### 1. Flight Search Flow

```
User Input (Search Form)
    ↓
FlightSearch.tsx
    ↓
search.service.ts → searchFlights()
    ↓
API: POST /search/flights
    ↓
Backend: search.controller.ts
    ↓
Backend: amadeus.service.ts
    ↓
External: Amadeus API
    ↓
Backend: Response with flights
    ↓
Frontend: Display in FlightResults.tsx
```

### 2. Booking Approval Flow

```
Traveller: Submit Booking
    ↓
booking.service.ts → createBooking()
    ↓
API: POST /bookings
    ↓
Backend: booking.service.ts
    ↓
Database: Save booking (status: PENDING)
    ↓
Kafka: Publish 'booking.created' event
    ↓
WebSocket: Notify Travel Arranger
    ↓
Arranger: See in ApprovalQueue.tsx
    ↓
Arranger: Approve/Reject
    ↓
API: POST /bookings/:id/approve
    ↓
Backend: Update booking status
    ↓
Kafka: Publish 'booking.approved' event
    ↓
WebSocket: Notify Traveller
    ↓
Traveller: Proceed to payment
```

### 3. Payment Flow

```
Approved Booking
    ↓
payment.service.ts → initializePayment()
    ↓
API: POST /payments/initialize
    ↓
Backend: paystack.service.ts
    ↓
External: Paystack API
    ↓
Backend: Payment URL
    ↓
Frontend: Redirect to Paystack
    ↓
User: Complete payment
    ↓
Paystack: Webhook callback
    ↓
Backend: Verify payment
    ↓
Database: Update booking (status: CONFIRMED)
    ↓
WebSocket: Notify user
    ↓
Frontend: Show confirmation
```

---

## Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **WebSocket:** Socket.io Client
- **UI Components:** Shadcn/UI
- **Form Handling:** React Hook Form + Zod
- **State Management:** React Context + Hooks
- **Notifications:** Sonner (toasts)
- **Icons:** Lucide React

### Backend
- **Framework:** NestJS (Node.js + TypeScript)
- **Database:** PostgreSQL (TypeORM)
- **Message Broker:** Apache Kafka
- **WebSocket:** Socket.io
- **Authentication:** JWT + Passport
- **Payment:** Paystack API
- **Flight/Hotel:** Amadeus API
- **Caching:** Redis (optional)
- **API Docs:** Swagger/OpenAPI

### DevOps
- **Containerization:** Docker + Docker Compose
- **Database Migrations:** TypeORM
- **Process Manager:** PM2 (production)
- **Reverse Proxy:** Nginx (production)

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend Dev Server | 5173 | http://localhost:5173 |
| Backend API | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Kafka | 9092 | localhost:9092 |
| Zookeeper | 2181 | localhost:2181 |
| Redis | 6379 | localhost:6379 |

---

## Docker Services

### Backend Containers

```yaml
services:
  app:           # NestJS application
  postgres:      # PostgreSQL database
  kafka:         # Kafka message broker
  zookeeper:     # Kafka dependency
  redis:         # Cache (optional)
```

### Container Communication

```
app container
    ↓
postgres://postgres:5432
kafka://kafka:9092
redis://redis:6379
```

---

## Environment Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### Backend (backend/.env)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/cobt

# JWT
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# APIs (optional)
AMADEUS_API_KEY=...
AMADEUS_API_SECRET=...
PAYSTACK_SECRET_KEY=...
PAYSTACK_PUBLIC_KEY=...

# Kafka
KAFKA_BROKERS=kafka:9092

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Search
- `POST /search/flights` - Search flights
- `POST /search/hotels` - Search hotels
- `POST /search/cars` - Search car rentals

### Bookings
- `GET /bookings` - List bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create booking
- `POST /bookings/:id/approve` - Approve booking
- `POST /bookings/:id/reject` - Reject booking

### Payments
- `POST /payments/initialize` - Initialize payment
- `POST /payments/verify/:reference` - Verify payment
- `POST /payments/webhook` - Paystack webhook

### Health
- `GET /health` - System health check

---

## WebSocket Events

### Emitted by Backend
- `booking.created` - New booking submitted
- `booking.approved` - Booking approved
- `booking.rejected` - Booking rejected
- `payment.completed` - Payment successful
- `notification` - General notification

### Emitted by Frontend
- `subscribe` - Subscribe to user notifications
- `unsubscribe` - Unsubscribe

---

## Database Schema

### Main Tables
- `users` - User accounts
- `bookings` - Travel bookings
- `flights` - Flight selections
- `hotels` - Hotel selections
- `cars` - Car rentals
- `payments` - Payment records
- `policies` - Travel policies
- `notifications` - User notifications

---

## Security

### Authentication
- JWT-based authentication
- Refresh token rotation
- Password hashing (bcrypt)
- Role-based access control (RBAC)

### Authorization
- Guards for protected routes
- Role checking middleware
- Resource ownership validation

### API Security
- CORS enabled for localhost:5173
- Rate limiting (optional)
- Input validation (class-validator)
- SQL injection prevention (TypeORM)

---

## Monitoring & Logging

### Health Checks
- Database connectivity
- Kafka connectivity
- External API status
- Redis status (if used)

### Logging
- Console logs (development)
- File logs (production)
- Error tracking
- Request logging

### Monitoring UI
- `/system-status` - Frontend monitoring page
- `/backend-test` - Backend connection test
- `/api/health` - Health endpoint

---

## Deployment Architecture (Production)

```
Internet
    ↓
Nginx Reverse Proxy
    ↓
    ├─→ Frontend (static files)
    └─→ Backend API (port 3000)
            ↓
        Docker Compose
            ├─→ App Container
            ├─→ PostgreSQL
            ├─→ Kafka
            └─→ Redis
```

---

This architecture provides:
- ✅ Scalability (microservices-ready)
- ✅ Real-time updates (WebSocket)
- ✅ Event-driven (Kafka)
- ✅ Reliability (health checks)
- ✅ Security (JWT, RBAC)
- ✅ Monitoring (status pages)
