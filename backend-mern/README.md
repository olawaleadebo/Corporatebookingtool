# COBT Backend - MERN Stack

Corporate Booking Tool Backend API built with MongoDB, Express, Node.js, and TypeScript.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Traveller, Travel Arranger, Admin)
- **Booking Management**: Complete booking workflow with approval system
- **Search Integration**: Amadeus API integration for flights and hotels with automatic fallback to mock data
- **Payment Processing**: Paystack integration for Nigerian Naira (₦) payments
- **Real-time Updates**: WebSocket support for live notifications
- **Redis Caching**: Upstash Redis for high-performance caching of search results
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Winston logger for comprehensive request/error logging

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB)
- Redis instance (Upstash recommended)
- npm >= 9.0.0

## 🛠️ Installation

1. **Clone and navigate to the backend folder**
```bash
cd backend-mern
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see Configuration section below).

## ⚙️ Configuration

The `.env` file contains all necessary configuration. Here's what you need to set:

### Database Configuration
```env
MONGODB_URI=mongodb+srv://hristesthr_db_user:Ro3VEkdZrbnio8wf@cluster0.rycx8qh.mongodb.net/corporatetest
```

### Redis Configuration
```env
REDIS_URL=rediss://default:AUrUAAIncDJkOTU1YTU5OTJkNDQ0YzE2YTdjYjlmNmQ2ZWVlMWI1OXAyMTkxNTY@thorough-dove-19156.upstash.io:6379
REDIS_CACHE_TTL=3600
ENABLE_REDIS_CACHE=true
```

### Server Configuration
```env
NODE_ENV=development
PORT=3001
API_VERSION=v1
```

### CORS & WebSocket Configuration
```env
CORS_ORIGIN=http://localhost:5173
WEBSOCKET_ORIGIN=http://localhost:5173
NGROK_URL=https://chromoplasmic-ungaping-danielle.ngrok-free.dev
ENABLE_WEBSOCKET=true
```

### JWT Configuration
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Amadeus API (optional - will use mock data if not provided)
```env
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
AMADEUS_ENV=test
```

### Paystack (optional - will use mock data if not provided)
```env
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### Feature Flags
```env
USE_MOCK_DATA=true
```

## 🚀 Running the Application

**Development mode (with hot reload)**
```bash
npm run dev
```

**Production build**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend-mern/
├── src/
│   ├── config/          # Configuration files (database, jwt)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic (Amadeus, Paystack)
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware (auth, error, logging)
│   ├── utils/           # Utilities (logger, mock data)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── logs/                # Application logs
├── package.json
└── tsconfig.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile

### Search
- `GET /api/v1/search/flights` - Search flights
- `GET /api/v1/search/hotels` - Search hotels
- `GET /api/v1/search/cars` - Search car rentals

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `GET /api/v1/bookings/pending/approvals` - Get pending approvals (Travel Arranger/Admin)
- `PATCH /api/v1/bookings/:id/approve` - Approve booking (Travel Arranger/Admin)
- `PATCH /api/v1/bookings/:id/reject` - Reject booking (Travel Arranger/Admin)
- `PATCH /api/v1/bookings/:id/confirm` - Confirm booking

### Payments
- `POST /api/v1/payments/initialize` - Initialize payment
- `GET /api/v1/payments/verify/:reference` - Verify payment
- `GET /api/v1/payments/booking/:bookingId` - Get payments by booking
- `POST /api/v1/payments/refund/:reference` - Refund payment (Admin only)

## 👥 User Roles

1. **Traveller**: Can create bookings and view their own bookings
2. **Travel Arranger**: Can approve/reject bookings, view all bookings
3. **Admin**: Full access including payment refunds

## 💾 Database Schema

### User
- email, password, firstName, lastName
- role (traveller, travel_arranger, admin)
- department, costCenter
- refreshToken, lastLogin

### Booking
- userId, bookingReference
- type (flight, hotel, car, complete)
- status (pending_approval, approved, rejected, confirmed, cancelled, completed, failed)
- flightDetails, hotelDetails, carDetails
- pricing (flightPrice, hotelPrice, carPrice, subtotal, tax, total)
- approval workflow (approverId, approverName, approvedAt, rejectedAt, rejectionReason)

### Payment
- bookingId, userId, amount, currency
- status (pending, processing, success, failed, refunded)
- paystackReference, paystackAccessCode, paystackAuthorizationUrl

## 🔒 Security Features

- JWT authentication with access & refresh tokens
- Password hashing with bcrypt
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS protection
- Input validation

## 📊 Logging

All requests and errors are logged using Winston:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output in development mode

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test
```

## 🐛 Mock Data Fallback

If Amadeus API is not configured or fails, the system automatically returns realistic Nigerian mock data:
- **Flights**: Arik Air, Air Peace, Ibom Air, etc. (₦110,000 - ₦925,000)
- **Hotels**: Eko Hotels, Transcorp Hilton, etc. (₦55,000 - ₦360,000)
- **Cars**: Economy, SUV, Luxury (₦15,000 - ₦65,000/day)

## 🔄 WebSocket Events

- `booking:update` - Booking status updates
- `payment:update` - Payment status updates

## 📝 Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

UNLICENSED - Private use only

## 🆘 Support

For issues or questions, contact BTMTravel development team.