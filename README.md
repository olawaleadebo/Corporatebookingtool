# COBT - Corporate Booking Tool

A comprehensive travel booking platform for corporate travel management built by BTMTravel.

![COBT Banner](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=300&fit=crop)

## 🚀 Features

### User Roles

#### **Travellers**
- Search and book flights, hotels, and car rentals
- View booking history and status
- Submit bookings for approval
- Make payments via Paystack
- Real-time notifications

#### **Travel Arrangers**
- Review and approve/reject booking requests
- Verify compliance with company policies
- Budget verification
- Bulk approval capabilities

#### **Admins**
- User management
- Company policy configuration
- Budget management
- Custom branding and logo upload
- Comprehensive reporting and analytics

### Core Capabilities

- ✈️ **Flight Search** - Amadeus API integration for real-time flight data
- 🏨 **Hotel Booking** - Integrated hotel search and booking
- 🚗 **Car Rental** - Car rental services
- 💳 **Payment Processing** - Paystack integration (Card, Bank Transfer, USSD)
- 📊 **Real-time Updates** - WebSocket for live notifications
- 🔄 **Event Streaming** - Kafka for async workflows
- 📈 **Analytics** - Booking trends and budget reports
- 🎨 **White-label** - Customizable branding and colors
- 💱 **Naira Currency** - ₦ (NGN) as primary currency

---

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router 7
- **UI Library**: Radix UI + TailwindCSS v4
- **State Management**: React Hooks + Context
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Message Broker**: Apache Kafka
- **Cache**: Redis
- **Authentication**: JWT + Passport
- **Payment**: Paystack SDK
- **Travel API**: Amadeus
- **WebSocket**: Socket.IO
- **Documentation**: Swagger/OpenAPI

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: NGINX
- **Logging**: Winston
- **Monitoring**: Health checks

---

## 📁 Project Structure

```
cobt/
├── src/                          # Frontend source
│   ├── app/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   └── utils/               # Utility functions
│   ├── services/                # API service layer
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   └── search.service.ts
│   └── lib/
│       ├── api.ts               # Axios configuration
│       └── websocket.ts         # WebSocket client
│
├── backend/                      # Backend source
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/            # Authentication
│   │   │   ├── booking/         # Booking management
│   │   │   ├── payment/         # Payment processing
│   │   │   ├── search/          # Amadeus integration
│   │   │   ├── kafka/           # Event streaming
│   │   │   └── websocket/       # Real-time updates
│   │   └── main.ts
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── deploy.sh
│
└── docs/
    ├── FRONTEND_INTEGRATION.md
    ├── backend/README.md
    ├── backend/DEPLOYMENT.md
    └── backend/INTEGRATION.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Docker** & **Docker Compose**
- **PostgreSQL** 15 (if not using Docker)
- **npm** or **pnpm**

### 1. Clone Repository

```bash
git clone <repository-url>
cd cobt
```

### 2. Start Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit with your credentials (Amadeus, Paystack, etc.)
nano .env

# Start with Docker (Recommended)
docker-compose up -d

# Create test accounts
chmod +x scripts/create-test-accounts.sh
./scripts/create-test-accounts.sh
```

Backend will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

### 3. Start Frontend

```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4. Login

Use these demo credentials:

**Traveller**
- Email: `traveller@test.com`
- Password: `Test123!`

**Travel Arranger**
- Email: `arranger@test.com`
- Password: `Test123!`

**Admin**
- Email: `admin@test.com`
- Password: `Test123!`

---

## 🔧 Configuration

### Frontend Environment Variables

Create `/.env`:

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### Backend Environment Variables

See `/backend/.env.example` for all options. Key variables:

```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=cobt_user
DB_PASSWORD=secure_password
DB_DATABASE=cobt_db

# JWT
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret

# Amadeus (Get from https://developers.amadeus.com)
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
AMADEUS_HOSTNAME=test.api.amadeus.com

# Paystack (Get from https://dashboard.paystack.com)
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

---

## 📖 Documentation

- **[Frontend Integration Guide](./FRONTEND_INTEGRATION.md)** - Frontend-backend integration status
- **[Backend README](./backend/README.md)** - Backend features and setup
- **[Deployment Guide](./backend/DEPLOYMENT.md)** - Production deployment
- **[API Integration](./backend/INTEGRATION.md)** - API usage examples
- **[Quick Start](./backend/QUICKSTART.md)** - Get running in 5 minutes

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register       # Register user
POST   /api/v1/auth/login          # Login
POST   /api/v1/auth/refresh        # Refresh token
POST   /api/v1/auth/logout         # Logout
```

### Search
```
GET    /api/v1/search/flights      # Search flights
GET    /api/v1/search/hotels       # Search hotels
```

### Bookings
```
POST   /api/v1/bookings            # Create booking
GET    /api/v1/bookings            # Get all bookings
GET    /api/v1/bookings/pending    # Get pending approvals
GET    /api/v1/bookings/:id        # Get booking details
PATCH  /api/v1/bookings/:id/approve    # Approve booking
PATCH  /api/v1/bookings/:id/reject     # Reject booking
```

### Payments
```
POST   /api/v1/payments/initialize     # Initialize payment
GET    /api/v1/payments/verify/:ref    # Verify payment
POST   /api/v1/payments/webhook        # Paystack webhook
```

Full API documentation: http://localhost:3000/api/docs

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests

```bash
# Run tests
npm run test
```

### Manual Testing

1. **Login Flow**: Test with demo accounts
2. **Flight Search**: Search LOS → LHR
3. **Booking Creation**: Create a complete booking
4. **Approval**: Approve booking as arranger
5. **Payment**: Test Paystack integration
6. **Real-time**: Check WebSocket notifications

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy

# Or Netlify
netlify deploy --prod
```

### Backend (VPS/Cloud)

```bash
cd backend

# Run deployment script
chmod +x deploy.sh
sudo ./deploy.sh
```

See [DEPLOYMENT.md](./backend/DEPLOYMENT.md) for detailed instructions.

---

## 🎨 Customization

### Branding

1. Login as **Admin**
2. Navigate to **Company Settings**
3. Upload your company logo
4. Customize colors and theme
5. Changes apply to all users

### White-labeling

The system is designed for multi-tenancy. Companies can:
- Upload custom logos
- Set brand colors
- Configure company policies
- Set budget limits
- Customize approval workflows

---

## 📊 Kafka Events

The system uses event-driven architecture:

### Booking Events
```javascript
{
  eventType: 'booking-created',
  bookingId: 'uuid',
  userId: 'uuid',
  amount: 245000,
  timestamp: '2026-03-03T10:00:00Z'
}
```

### Payment Events
```javascript
{
  eventType: 'payment-success',
  paymentId: 'uuid',
  bookingId: 'uuid',
  amount: 245000,
  timestamp: '2026-03-03T10:05:00Z'
}
```

---

## 🔒 Security

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ HTTPS/TLS encryption
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Webhook signature verification

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

Proprietary - BTMTravel © 2026

---

## 🆘 Support

For issues and questions:

- **Email**: support@btmtravel.com
- **Documentation**: Full docs in `/backend` folder
- **API Docs**: http://localhost:3000/api/docs
- **Issues**: GitHub Issues

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Expense management
- [ ] Travel policy automation
- [ ] Integration with accounting systems
- [ ] AI-powered travel recommendations
- [ ] Carbon footprint tracking
- [ ] Group bookings
- [ ] Travel insurance

---

## 👥 Team

**BTMTravel Development Team**

- Product Manager
- Backend Developers
- Frontend Developers
- DevOps Engineers
- QA Engineers

---

## 🙏 Acknowledgments

- **Amadeus** for travel API
- **Paystack** for payment processing
- **NestJS** for backend framework
- **React** for frontend framework
- **Radix UI** for component library

---

**Built with ❤️ by BTMTravel**
