# Quick Start: Frontend-Backend Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL, Kafka, and Redis with Docker
docker-compose up -d

# Wait 10 seconds for services to start
sleep 10

# Install dependencies (if not already done)
npm install

# Run database migrations to create tables
npx typeorm migration:run -d src/config/typeorm.config.ts

# Start the NestJS backend
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345  - 03/05/2026, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 03/05/2026, 10:30:46 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 03/05/2026, 10:30:46 AM     LOG [RoutesResolver] BookingController {/api/v1/bookings}
[Nest] 12345  - 03/05/2026, 10:30:46 AM     LOG [NestApplication] Nest application successfully started
```

### Step 2: Verify Backend is Running

Open a new terminal and test:

```bash
# Check health endpoint
curl http://localhost:3000/api/v1/health

# Expected response:
# {"status":"ok","database":"connected","timestamp":"2026-03-05T..."}
```

### Step 3: Create Test Users

```bash
# Still in backend directory
npm run seed:users

# This creates:
# - traveller@test.com / Test123!
# - arranger@test.com / Test123!
# - admin@test.com / Test123!
```

### Step 4: Start the Frontend

Open a new terminal:

```bash
# From project root
npm install  # if not already done
npm run dev

# Frontend will start on http://localhost:5173
```

### Step 5: Test the Integration

1. **Open Browser**: Navigate to `http://localhost:5173`

2. **Login**: 
   - Email: `traveller@test.com`
   - Password: `Test123!`
   - Click "Login" or use "Demo Traveller Account" button

3. **Search Flights**:
   - From: Lagos
   - To: Abuja (or any city)
   - Departure: Any future date
   - Click "Search Flights"
   - ✅ You should see real flight results from Amadeus API (or mock data if API not configured)

4. **Complete Booking**:
   - Select a flight → Continue to Hotel
   - Select or skip hotel → Continue to Car  
   - Select or skip car → View Summary
   - Enter justification (e.g., "Business trip to meet clients")
   - Click "Submit for Approval"
   - ✅ You should see success message and booking reference

5. **View Bookings**:
   - Navigate to "My Bookings"
   - ✅ You should see your newly created booking with status "Pending Approval"

6. **Approve Booking** (as Travel Arranger):
   - Logout
   - Login as: `arranger@test.com` / `Test123!`
   - Navigate to "Approval Queue"
   - ✅ You should see pending booking request
   - Click "Approve" and confirm
   - ✅ Booking status changes to "Approved"

7. **Real-time Notifications**:
   - Keep both accounts logged in (use incognito for arranger)
   - Approve a booking as arranger
   - ✅ Traveller should see instant toast notification via WebSocket

## ✅ What's Integrated

### Pages with Full Backend Integration:

1. **Login.tsx** ✅
   - Real authentication via `/auth/login`
   - JWT token management
   - Role-based routing
   - Backend status checking

2. **FlightResults.tsx** ✅
   - Real flight search via `/search/flights`
   - Amadeus API integration
   - Loading states
   - Error handling with fallback

3. **BookingSummary.tsx** ✅
   - Create bookings via `/bookings`
   - Cost center & project code support
   - Success notifications

4. **MyBookings.tsx** ✅
   - Fetch bookings via `/bookings`
   - WebSocket real-time updates
   - Status badges
   - Mock fallback

5. **ApprovalQueue.tsx** ✅
   - Fetch pending via `/bookings/pending`
   - Approve via `/bookings/:id/approve`
   - Reject via `/bookings/:id/reject`
   - WebSocket updates

6. **PaymentConfirmation.tsx** ✅
   - Initialize payment via `/payments/initialize`
   - Paystack integration
   - Payment verification
   - Success handling

### Services Ready:

- ✅ `authService` - Login, register, logout, token refresh
- ✅ `bookingService` - CRUD operations, approvals
- ✅ `searchService` - Flights, hotels
- ✅ `paymentService` - Initialize, verify
- ✅ `userService` - User management
- ✅ `websocket` - Real-time updates

## 🔧 Configuration

### Frontend Environment (.env)

Create `.env` in project root:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### Backend Environment (backend/.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=cobt_user
DB_PASSWORD=1234
DB_DATABASE=cobt_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Amadeus API (optional - uses mock data if not configured)
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret

# Paystack (optional - uses test mode if not configured)
PAYSTACK_SECRET_KEY=sk_test_your_paystack_test_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Kafka
KAFKA_BROKERS=localhost:9092

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📊 Database Migrations

If you need to recreate the database:

```bash
cd backend

# Drop all tables
npm run migration:revert

# Create all tables
npm run migration:run

# Seed test data
npm run seed:users
```

## 🧪 Testing API Endpoints

### 1. Test Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"traveller@test.com","password":"Test123!"}'
```

### 2. Test Flight Search (needs JWT token from login)
```bash
curl -X GET "http://localhost:3000/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-01&adults=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Test Create Booking (needs JWT token)
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "flight",
    "flightDetails": {"airline": "Test Air", "price": 50000},
    "flightPrice": 50000,
    "justification": "Business trip"
  }'
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** 
```bash
# Check if backend is running
curl http://localhost:3000/api/v1/health

# If not running, start it:
cd backend && npm run start:dev
```

### Issue: "Database connection failed"
**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# If not, start Docker services:
cd backend && docker-compose up -d
```

### Issue: "No flights found"
**Solution:** 
- Check Amadeus API credentials in backend/.env
- Or ignore - frontend will use mock data for development

### Issue: "Token expired"
**Solution:** 
- Frontend automatically refreshes tokens
- If issue persists, logout and login again

### Issue: "CORS error"
**Solution:**
```typescript
// Verify in backend/src/main.ts:
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

## 📱 Testing Real-time Features

### WebSocket Connection Test:

1. Open browser DevTools → Console
2. Login to the app
3. You should see:
   ```
   ✅ WebSocket connected
   ```

4. Create a booking as traveller
5. Approve it as arranger (in another browser/tab)
6. Watch traveller's browser - should see instant notification

## 🎯 Next Steps

### Remaining Integrations:

1. **HotelSearch.tsx** - Follow FlightResults.tsx pattern:
   ```typescript
   useEffect(() => {
     const fetchHotels = async () => {
       const results = await searchService.searchHotels({...});
       setHotels(results);
     };
     fetchHotels();
   }, []);
   ```

2. **Admin Pages** - Connect to backend:
   - UserManagement → `userService.getAllUsers()`
   - PolicyManagement → Create policy service
   - BudgetManagement → Create budget service
   - Reports → Create reports service

3. **Enhanced Features**:
   - File uploads for receipts
   - Email notifications
   - PDF export
   - Analytics dashboard

## 📚 Documentation

- **Full Integration Guide**: See `/FRONTEND_BACKEND_INTEGRATION.md`
- **API Docs**: `http://localhost:3000/api/docs` (when backend running)
- **Backend README**: `/backend/README.md`

## 🎉 Success Indicators

You know integration is working when:

1. ✅ Login redirects based on user role
2. ✅ Flight search shows results (real or mock)
3. ✅ Booking creation returns reference number
4. ✅ Bookings appear in "My Bookings"
5. ✅ Travel arranger sees pending approvals
6. ✅ Approval updates show instantly
7. ✅ WebSocket connection stays active
8. ✅ Token refresh happens automatically
9. ✅ Error toasts appear for failures
10. ✅ No console errors in browser

## 🚀 Production Deployment

Before deploying to production:

1. Update environment variables
2. Configure real Amadeus API keys
3. Set up real Paystack account
4. Change JWT secrets
5. Set up production database
6. Configure CORS for production domain
7. Enable HTTPS
8. Set up monitoring
9. Configure email service
10. Test payment flows thoroughly

---

**Integration Status**: ✅ Complete  
**Date**: March 5, 2026  
**Ready for**: Development & Testing  
**Next**: Configure API keys and test production deployment
