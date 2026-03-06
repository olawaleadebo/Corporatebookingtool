# 🏗️ COBT Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         COBT Backend API                         │
│                     (MERN Stack - Port 3001)                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼──────┐          ┌──────▼──────┐
              │   HTTP     │          │  WebSocket  │
              │   Server   │          │   Server    │
              └─────┬──────┘          └──────┬──────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      Express App        │
                    │   Middleware Stack      │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐           ┌─────▼──────┐         ┌─────▼──────┐
    │  CORS   │           │   Helmet   │         │  Rate      │
    │ Multi-  │           │  Security  │         │  Limiter   │
    │ Origin  │           │  Headers   │         │  100/15min │
    └────┬────┘           └─────┬──────┘         └─────┬──────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      API Routes         │
                    │      /api/v1/...        │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐           ┌─────▼──────┐         ┌─────▼──────┐
    │  Auth   │           │   Search   │         │  Booking   │
    │  Routes │           │   Routes   │         │   Routes   │
    └────┬────┘           └─────┬──────┘         └─────┬──────┘
         │                       │                       │
         │                  ┌────▼──────┐               │
         │                  │  Payment  │               │
         │                  │  Routes   │               │
         │                  └────┬──────┘               │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Controllers         │
                    │   Business Logic        │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐           ┌─────▼──────┐         ┌─────▼──────┐
    │ Amadeus │           │   Cache    │         │  Paystack  │
    │ Service │           │  Service   │         │  Service   │
    └────┬────┘           └─────┬──────┘         └─────┬──────┘
         │                       │                       │
         │                  ┌────▼──────┐               │
         │                  │   Redis   │               │
         │                  │  (Upstash)│               │
         │                  └───────────┘               │
         │                                              │
         └───────────────────────┬──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    MongoDB Atlas        │
                    │   (corporatetest DB)    │
                    └─────────────────────────┘
```

## Component Architecture

### 1. Entry Point (`server.ts`)
```
┌─────────────────────────────────────┐
│         server.ts                    │
├─────────────────────────────────────┤
│ • Load environment variables         │
│ • Connect to MongoDB                 │
│ • Initialize Redis client            │
│ • Create App instance                │
│ • Start HTTP server                  │
│ • Handle process signals             │
└─────────────────────────────────────┘
```

### 2. Application Layer (`app.ts`)
```
┌─────────────────────────────────────┐
│         App Class                    │
├─────────────────────────────────────┤
│ • Initialize Express                 │
│ • Setup HTTP Server                  │
│ • Setup WebSocket Server             │
│ • Configure middleware               │
│ • Register routes                    │
│ • Setup error handling               │
└─────────────────────────────────────┘
```

### 3. Middleware Stack
```
Request Flow:
    │
    ├─► 1. Helmet (Security headers)
    │
    ├─► 2. CORS (Multi-origin support)
    │       ├─ http://localhost:5173
    │       ├─ http://localhost:3000
    │       └─ https://chromoplasmic-ungaping-danielle.ngrok-free.dev
    │
    ├─► 3. Body Parser (JSON/URL-encoded)
    │
    ├─► 4. Compression (Gzip)
    │
    ├─► 5. Request Logger (Winston)
    │
    ├─► 6. Rate Limiter (100 req/15min)
    │
    └─► 7. Route Handler
```

### 4. Route Architecture
```
/api/v1
│
├─► /auth
│   ├─ POST   /register
│   ├─ POST   /login
│   ├─ POST   /refresh-token
│   ├─ POST   /logout
│   └─ GET    /profile
│
├─► /search
│   ├─ GET    /flights      [Cached: 30min]
│   ├─ GET    /hotels       [Cached: 30min]
│   └─ GET    /cars         [Cached: 30min]
│
├─► /bookings
│   ├─ POST   /             [Auth Required]
│   ├─ GET    /             [Auth Required]
│   ├─ GET    /:id          [Auth Required]
│   ├─ GET    /pending/approvals [Arranger/Admin]
│   ├─ PATCH  /:id/approve  [Arranger/Admin]
│   ├─ PATCH  /:id/reject   [Arranger/Admin]
│   └─ PATCH  /:id/confirm  [Auth Required]
│
└─► /payments
    ├─ POST   /initialize   [Auth Required]
    ├─ GET    /verify/:ref  [Auth Required]
    ├─ GET    /booking/:id  [Auth Required]
    └─ POST   /refund/:ref  [Admin Only]
```

### 5. Service Layer
```
┌────────────────────────┬────────────────────────┐
│   Amadeus Service      │   Paystack Service     │
├────────────────────────┼────────────────────────┤
│ • Search flights       │ • Initialize payment   │
│ • Search hotels        │ • Verify payment       │
│ • Mock data fallback   │ • Process refund       │
└────────────────────────┴────────────────────────┘
                │
┌───────────────▼───────────────────────────────────┐
│              Cache Service                        │
├──────────────────────────────────────────────────┤
│ • get<T>(key): Promise<T>                        │
│ • set(key, value, ttl): Promise<boolean>         │
│ • getOrSet<T>(key, fn, ttl): Promise<T>          │
│ • generateFlightSearchKey(params)                │
│ • generateHotelSearchKey(params)                 │
│ • generateCarSearchKey(params)                   │
└──────────────────────────────────────────────────┘
                │
┌───────────────▼───────────────────────────────────┐
│              Redis Client (Upstash)               │
├──────────────────────────────────────────────────┤
│ • TLS connection (rediss://)                     │
│ • Automatic retry with backoff                   │
│ • Connection event logging                       │
│ • Graceful degradation on failure                │
└──────────────────────────────────────────────────┘
```

### 6. Database Layer
```
┌─────────────────────────────────────┐
│      MongoDB Atlas                   │
│   (corporatetest database)           │
├─────────────────────────────────────┤
│                                      │
│  ┌────────────────┐                 │
│  │ users          │                 │
│  ├────────────────┤                 │
│  │ • email        │                 │
│  │ • password     │                 │
│  │ • role         │                 │
│  │ • department   │                 │
│  └────────────────┘                 │
│                                      │
│  ┌────────────────┐                 │
│  │ bookings       │                 │
│  ├────────────────┤                 │
│  │ • userId       │                 │
│  │ • status       │                 │
│  │ • flightDetails│                 │
│  │ • hotelDetails │                 │
│  │ • carDetails   │                 │
│  │ • pricing      │                 │
│  └────────────────┘                 │
│                                      │
│  ┌────────────────┐                 │
│  │ payments       │                 │
│  ├────────────────┤                 │
│  │ • bookingId    │                 │
│  │ • amount       │                 │
│  │ • status       │                 │
│  │ • paystack...  │                 │
│  └────────────────┘                 │
│                                      │
└─────────────────────────────────────┘
```

### 7. WebSocket Architecture
```
┌────────────────────────────────────────────┐
│         WebSocket Server                    │
│         (Socket.IO)                         │
├────────────────────────────────────────────┤
│                                             │
│  Events In:                                 │
│  ├─ join(userId)                            │
│  ├─ booking:update(data)                    │
│  └─ payment:update(data)                    │
│                                             │
│  Events Out:                                │
│  ├─ booking:updated                         │
│  ├─ payment:updated                         │
│  └─ notification                            │
│                                             │
│  Rooms:                                     │
│  └─ user:{userId}                           │
│                                             │
└────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Flight Search Flow (with Cache)
```
┌──────────┐
│  Client  │
└─────┬────┘
      │ GET /api/v1/search/flights?origin=LOS&destination=ABV...
      ▼
┌──────────────┐
│ Controller   │
└──────┬───────┘
       │ 1. Generate cache key: "flights:LOS:ABV:2026-03-15:1"
       ▼
┌──────────────┐
│ Cache Service│
└──────┬───────┘
       │ 2. Check Redis
       ▼
┌──────────────┐
│    Redis     │
└──────┬───────┘
       │
       ├─► Cache HIT (50ms) ──────────────────┐
       │                                       │
       └─► Cache MISS                          │
              │                                │
              ▼                                │
       ┌──────────────┐                       │
       │   Amadeus    │                       │
       │   Service    │                       │
       └──────┬───────┘                       │
              │ 3. Fetch from API (2000ms)    │
              ▼                                │
       ┌──────────────┐                       │
       │    Redis     │                       │
       │  (store for  │                       │
       │   30 min)    │                       │
       └──────┬───────┘                       │
              │                                │
              └────────────────────────────────┤
                                               │
                                               ▼
                                        ┌──────────┐
                                        │  Client  │
                                        └──────────┘
```

### Booking Approval Flow (with WebSocket)
```
┌───────────┐
│ Traveller │
└─────┬─────┘
      │ 1. POST /api/v1/bookings
      ▼
┌──────────────┐
│   Booking    │
│  Controller  │
└──────┬───────┘
       │ 2. Create booking (status: pending_approval)
       ▼
┌──────────────┐
│   MongoDB    │
└──────┬───────┘
       │ 3. Save booking
       ▼
┌──────────────┐
│  WebSocket   │
│   emit()     │
└──────┬───────┘
       │ 4. Emit to travel arranger
       ▼
┌──────────────┐
│Travel Arranger│
└──────┬───────┘
       │ 5. PATCH /api/v1/bookings/:id/approve
       ▼
┌──────────────┐
│   Booking    │
│  Controller  │
└──────┬───────┘
       │ 6. Update status (approved)
       ▼
┌──────────────┐
│   MongoDB    │
└──────┬───────┘
       │ 7. Save update
       ▼
┌──────────────┐
│  WebSocket   │
│   emit()     │
└──────┬───────┘
       │ 8. Emit to traveller
       ▼
┌───────────┐
│ Traveller │
│ (notified)│
└───────────┘
```

## Security Architecture

### Authentication Flow
```
┌──────────┐
│  Client  │
└─────┬────┘
      │ POST /api/v1/auth/login
      │ { email, password }
      ▼
┌──────────────┐
│Auth Controller│
└──────┬───────┘
       │ 1. Validate input
       ▼
┌──────────────┐
│  User Model  │
└──────┬───────┘
       │ 2. Find user by email
       ▼
┌──────────────┐
│    bcrypt    │
└──────┬───────┘
       │ 3. Compare passwords
       ▼
┌──────────────┐
│  JWT Service │
└──────┬───────┘
       │ 4. Generate tokens
       │    ├─ Access Token (7 days)
       │    └─ Refresh Token (30 days)
       ▼
┌──────────┐
│  Client  │
│ (tokens) │
└──────────┘
```

### Protected Route Flow
```
┌──────────┐
│  Client  │
└─────┬────┘
      │ GET /api/v1/bookings
      │ Header: Authorization: Bearer <token>
      ▼
┌──────────────┐
│Auth Middleware│
└──────┬───────┘
       │ 1. Extract token
       ▼
┌──────────────┐
│  JWT Service │
└──────┬───────┘
       │ 2. Verify signature
       │ 3. Check expiration
       ▼
┌──────────────┐
│  User Model  │
└──────┬───────┘
       │ 4. Attach user to request
       ▼
┌──────────────┐
│  Controller  │
│  (authorized)│
└──────────────┘
```

## Performance Optimization

### Caching Strategy
```
Layer 1: Redis Cache (30 min TTL)
   ├─ flights:*
   ├─ hotels:*
   └─ cars:*

Layer 2: In-Memory (WebSocket connections)
   └─ Active socket connections

Layer 3: Database (MongoDB Atlas)
   ├─ Indexed queries
   └─ Connection pooling
```

### Request Optimization
```
1. Compression (gzip)
   └─ ~70% size reduction

2. Rate Limiting
   └─ Prevent abuse

3. Connection Pooling
   └─ Reuse database connections

4. Lazy Loading
   └─ Load data on demand
```

## Deployment Architecture

### Development
```
┌──────────────────────────────────────┐
│      Developer Machine                │
├──────────────────────────────────────┤
│  ┌────────────────────────────┐     │
│  │   Backend (localhost:3001)  │     │
│  └────────────────────────────┘     │
│                                      │
│  ┌────────────────────────────┐     │
│  │  Frontend (localhost:5173)  │     │
│  └────────────────────────────┘     │
└──────────────────────────────────────┘
         │              │
         │              └───────────┐
         │                          │
    ┌────▼─────┐              ┌─────▼────┐
    │ MongoDB  │              │  Redis   │
    │  Atlas   │              │ Upstash  │
    └──────────┘              └──────────┘
```

### Production
```
┌────────────────────────────────────────┐
│        Cloud Platform                   │
│        (e.g., AWS, Heroku, Railway)    │
├────────────────────────────────────────┤
│  ┌─────────────────────────────────┐  │
│  │   Load Balancer                  │  │
│  └────────────┬────────────────────┘  │
│               │                        │
│  ┌────────────▼────────────┐          │
│  │   Backend Instances     │          │
│  │   (Auto-scaling)        │          │
│  └────────────┬────────────┘          │
└───────────────┼────────────────────────┘
                │
       ┌────────┼────────┐
       │                 │
  ┌────▼─────┐     ┌─────▼────┐
  │ MongoDB  │     │  Redis   │
  │  Atlas   │     │ Upstash  │
  └──────────┘     └──────────┘
```

## Technology Stack Summary

```
┌──────────────────────────────────────┐
│         Runtime & Language            │
│  • Node.js 18+                        │
│  • TypeScript 5.3                     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         Web Framework                 │
│  • Express.js 4.18                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         Database & Cache              │
│  • MongoDB 8.0 (Mongoose ODM)         │
│  • Redis (ioredis client)             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         Real-time Communication       │
│  • Socket.IO 4.6                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         Security                      │
│  • Helmet (HTTP headers)              │
│  • bcrypt (Password hashing)          │
│  • JWT (Authentication)               │
│  • CORS (Cross-origin)                │
│  • express-rate-limit                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         External Services             │
│  • Amadeus API (Flight/Hotel search)  │
│  • Paystack API (Payments)            │
│  • MongoDB Atlas (Database)           │
│  • Upstash Redis (Cache)              │
│  • ngrok (External access)            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│         Utilities                     │
│  • Winston (Logging)                  │
│  • axios (HTTP client)                │
│  • dotenv (Environment)               │
│  • compression (Gzip)                 │
└──────────────────────────────────────┘
```

---

**This architecture is designed for:**
- ✅ Scalability (Cloud services)
- ✅ Performance (Redis caching)
- ✅ Real-time updates (WebSocket)
- ✅ Security (JWT + RBAC)
- ✅ Reliability (Fallback systems)
- ✅ Maintainability (Clean architecture)

**Last Updated:** March 6, 2026
