# COBT Backend

Corporate Booking Tool (COBT) Backend API - Production-grade travel booking platform

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- ✈️ **Amadeus Integration** - Flight and hotel search, pricing, and booking
- 💳 **Paystack Integration** - Payment processing with card, bank transfer, and USSD
- 📊 **Kafka Event Streaming** - Asynchronous workflows and event-driven architecture
- 🔄 **WebSockets** - Real-time updates for bookings and payments
- 🐘 **PostgreSQL** - Relational database with TypeORM
- 🐳 **Docker** - Containerized deployment
- 📝 **API Documentation** - Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL 15
- **Message Broker**: Apache Kafka
- **Cache**: Redis
- **ORM**: TypeORM
- **Payment**: Paystack SDK
- **Travel API**: Amadeus
- **WebSockets**: Socket.IO
- **Logging**: Winston
- **Documentation**: Swagger

## Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- PostgreSQL 15
- Kafka & Zookeeper

## Installation

### 1. Clone and install dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following in `.env`:

- **Database credentials**
- **JWT secrets**
- **Amadeus API credentials**
- **Paystack API keys**
- **Kafka configuration**

### 3. Docker Deployment (Recommended)

```bash
# Start all services (PostgreSQL, Kafka, Zookeeper, Redis, API, NGINX)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

### 4. Local Development

```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at:
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Search
- `GET /api/v1/search/flights` - Search flights
- `GET /api/v1/search/hotels` - Search hotels

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `GET /api/v1/bookings/pending` - Get pending approvals
- `PATCH /api/v1/bookings/:id/approve` - Approve booking
- `PATCH /api/v1/bookings/:id/reject` - Reject booking

### Payments
- `POST /api/v1/payments/initialize` - Initialize payment
- `GET /api/v1/payments/verify/:reference` - Verify payment
- `POST /api/v1/payments/webhook` - Paystack webhook

## Architecture

### Modules

```
src/
├── modules/
│   ├── auth/           # Authentication & JWT
│   ├── users/          # User management
│   ├── search/         # Amadeus integration
│   ├── booking/        # Booking workflow
│   ├── payment/        # Paystack integration
│   ├── notification/   # Notifications
│   ├── policy/         # Company policies
│   ├── kafka/          # Event streaming
│   ├── websocket/      # Real-time updates
│   └── health/         # Health checks
```

### Database Schema

**Users**
- id, email, password, firstName, lastName
- role (traveller, travel_arranger, admin, support)
- status, department, costCenter

**Bookings**
- id, bookingReference, userId, type, status
- flightDetails, hotelDetails, carDetails
- pricing (flightPrice, hotelPrice, carPrice, total)
- justification, costCenter, approverId
- amadeusData (PNR, ticket numbers)

**Payments**
- id, reference, userId, bookingId
- amount, currency, status, method
- paystackReference, paystackResponse

### Kafka Topics

- `booking-events` - Booking lifecycle events
- `payment-events` - Payment status updates
- `notification-events` - User notifications

### Event Types

**Booking Events:**
- booking-created
- booking-approved
- booking-rejected
- booking-confirmed
- booking-failed

**Payment Events:**
- payment-initiated
- payment-success
- payment-failed
- payment-refunded

## Amadeus Integration

### Setup

1. Register at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create an app and get API credentials
3. Add credentials to `.env`:
   ```
   AMADEUS_CLIENT_ID=your_client_id
   AMADEUS_CLIENT_SECRET=your_client_secret
   AMADEUS_HOSTNAME=test.api.amadeus.com
   ```

### Features

- Flight search with pricing
- Hotel search by city
- Flight booking with PNR generation
- Price validation

## Paystack Integration

### Setup

1. Register at [Paystack](https://paystack.com/)
2. Get API keys from dashboard
3. Add to `.env`:
   ```
   PAYSTACK_SECRET_KEY=sk_test_xxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxx
   PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
   ```

### Payment Methods

- Card payments
- Bank transfer
- USSD
- Mobile money

### Webhook Handling

Set webhook URL in Paystack dashboard:
```
https://your-domain.com/api/v1/payments/webhook
```

## Kafka Event Streaming

### Topics Configuration

Events are automatically published to Kafka topics:

```javascript
// Booking created
{
  eventType: 'booking-created',
  bookingId: 'uuid',
  userId: 'uuid',
  amount: 150000,
  timestamp: '2026-03-03T10:00:00Z'
}
```

### Consumer Groups

- `cobt-consumer-group` - Main consumer group for processing events

## WebSocket Events

Connect to WebSocket for real-time updates:

```javascript
const socket = io('http://localhost:3000');

// Listen for booking updates
socket.on('booking:updated', (data) => {
  console.log('Booking updated:', data);
});

// Listen for payment updates
socket.on('payment:completed', (data) => {
  console.log('Payment completed:', data);
});
```

## Monitoring & Logging

### Logs

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

### Health Check

```bash
curl http://localhost:3000/api/v1/health
```

## Production Deployment

### VPS Deployment Steps

1. **Prepare VPS**
   ```bash
   # Install Docker & Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Clone repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

4. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Setup SSL (Optional)**
   ```bash
   # Use Let's Encrypt with Certbot
   # Update nginx.conf with SSL configuration
   ```

### Environment Variables (Production)

Make sure to set secure values for:
- `JWT_SECRET` - Strong random string
- `JWT_REFRESH_SECRET` - Different strong random string
- `DB_PASSWORD` - Secure database password
- `PAYSTACK_SECRET_KEY` - Production Paystack key
- `AMADEUS_CLIENT_ID` - Production Amadeus credentials

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Security

- ✅ Helmet for security headers
- ✅ Rate limiting on API endpoints
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with class-validator
- ✅ SQL injection prevention (TypeORM)
- ✅ CORS configuration

## API Documentation

Access Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Support

For issues and questions:
- Email: support@btmtravel.com
- Documentation: [Link to docs]

## License

Proprietary - BTMTravel © 2026
