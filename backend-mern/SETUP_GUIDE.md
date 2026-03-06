# COBT Backend - Complete Setup Guide

This guide will walk you through setting up the MERN backend with MongoDB Atlas, Upstash Redis, and ngrok for WebSocket support.

## 📦 Quick Setup

### Step 1: Install Dependencies

```bash
cd backend-mern
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Configure Environment Variables

The `.env.example` file already contains the production-ready configuration. You can use it as-is or customize:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database Configuration (Already configured with MongoDB Atlas)
MONGODB_URI=mongodb+srv://hristesthr_db_user:Ro3VEkdZrbnio8wf@cluster0.rycx8qh.mongodb.net/corporatetest

# Redis Configuration (Already configured with Upstash)
REDIS_URL=rediss://default:AUrUAAIncDJkOTU1YTU5OTJkNDQ0YzE2YTdjYjlmNmQ2ZWVlMWI1OXAyMTkxNTY@thorough-dove-19156.upstash.io:6379
REDIS_CACHE_TTL=3600
ENABLE_REDIS_CACHE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# WebSocket & ngrok Configuration
WEBSOCKET_ORIGIN=http://localhost:5173
NGROK_URL=https://chromoplasmic-ungaping-danielle.ngrok-free.dev
ENABLE_WEBSOCKET=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Amadeus API (Optional)
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
AMADEUS_ENV=test

# Paystack (Optional)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Feature Flags
USE_MOCK_DATA=true
LOG_LEVEL=info
```

### Step 4: Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🔧 Detailed Configuration

### MongoDB Atlas Configuration

The backend is already configured to use MongoDB Atlas:

- **Connection String**: `mongodb+srv://hristesthr_db_user:Ro3VEkdZrbnio8wf@cluster0.rycx8qh.mongodb.net/corporatetest`
- **Database Name**: `corporatetest`
- **Collections**: Users, Bookings, Payments (created automatically)

**Features:**
- Automatic connection retry
- Graceful shutdown handling
- Connection event logging

### Redis (Upstash) Configuration

Redis is used for caching search results to improve performance:

- **Connection String**: `rediss://default:...@thorough-dove-19156.upstash.io:6379`
- **Cache TTL**: 3600 seconds (1 hour) by default
- **TLS**: Enabled for secure connections

**Cached Data:**
- Flight search results (30 minutes)
- Hotel search results (30 minutes)
- Car rental search results (30 minutes)

**Benefits:**
- Faster response times for repeated searches
- Reduced API calls to Amadeus
- Lower costs
- Better user experience

**Fallback Behavior:**
If Redis is unavailable, the API will still work but without caching.

### WebSocket Configuration

WebSocket support is enabled for real-time updates:

**Local Development:**
```env
WEBSOCKET_ORIGIN=http://localhost:5173
```

**Production (with ngrok):**
```env
NGROK_URL=https://chromoplasmic-ungaping-danielle.ngrok-free.dev
```

**Supported Events:**
- `join` - Join user-specific room
- `booking:update` - Real-time booking updates
- `payment:update` - Real-time payment updates

**Client Connection Example:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

socket.emit('join', userId);

socket.on('booking:updated', (data) => {
  console.log('Booking updated:', data);
});

socket.on('payment:updated', (data) => {
  console.log('Payment updated:', data);
});
```

### ngrok Setup (for external access)

The backend is configured to work with ngrok for external access:

**Current ngrok URL:** `https://chromoplasmic-ungaping-danielle.ngrok-free.dev`

This URL exposes `localhost:3000` and is already configured in the CORS settings.

**To update ngrok URL:**
1. Start ngrok: `ngrok http 3000`
2. Copy the generated URL
3. Update `NGROK_URL` in `.env`
4. Restart the backend server

## 🚀 Running the Application

### Development Mode (Recommended)

```bash
npm run dev
```

Features:
- Hot reload on file changes
- Detailed logging to console
- Source maps for debugging

### Production Mode

```bash
npm run build
npm start
```

Features:
- Optimized TypeScript compilation
- Production-ready performance
- Minimal logging

### Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-03-06T..."
}
```

## 📊 Monitoring & Debugging

### Logs

Logs are stored in the `/logs` directory:

- `combined.log` - All logs (info, warn, error)
- `error.log` - Error logs only

**Log Format:**
```json
{
  "level": "info",
  "message": "User logged in",
  "context": "AuthController",
  "userId": "65abc123...",
  "timestamp": "2026-03-06T10:30:00.000Z"
}
```

### Redis Monitoring

Check Redis connection status:
```bash
curl http://localhost:3001/health
# Look for Redis connection logs in console
```

View Redis cache keys (in Redis CLI or Upstash Console):
```redis
KEYS *
GET flights:LOS:ABV:2026-03-15:1
```

### Database Monitoring

Check MongoDB connection in logs:
```
MongoDB connected successfully
```

View database in MongoDB Atlas dashboard or use Compass.

## 🔐 Security Configuration

### JWT Tokens

- **Access Token**: Expires in 7 days
- **Refresh Token**: Expires in 30 days

**Important:** Change `JWT_SECRET` in production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### CORS

The backend accepts requests from:
- `http://localhost:5173` (Frontend dev server)
- `http://localhost:3000` (Alternative port)
- ngrok URL (for external access)

To add more origins, update the `allowedOrigins` array in `src/app.ts`.

### Rate Limiting

- **Window**: 15 minutes (900,000 ms)
- **Max Requests**: 100 per window
- **Applies to**: All `/api/*` routes

Customize in `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Seeding

### Create Initial Users

```bash
npm run seed
```

This creates:
- Admin user
- Travel Arranger user
- Traveller user

Default credentials will be logged to the console.

## 🧪 Testing the API

### Register a User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveller@btmtravel.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "traveller",
    "department": "Engineering",
    "costCenter": "ENG-001"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveller@btmtravel.com",
    "password": "SecurePass123!"
  }'
```

### Search Flights

```bash
curl "http://localhost:3001/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-15&adults=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Booking

```bash
curl -X POST http://localhost:3001/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "type": "complete",
    "flightDetails": {...},
    "hotelDetails": {...},
    "carDetails": {...},
    "pricing": {...}
  }'
```

## 🔄 Integration with Frontend

### Update Frontend API Base URL

In your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WEBSOCKET_URL=http://localhost:3001
```

### CORS Headers

The backend automatically adds CORS headers for allowed origins. Make sure your frontend makes requests with credentials:

```javascript
fetch('http://localhost:3001/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important for cookies/auth
  body: JSON.stringify(credentials)
});
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** "MongoDB connection failed"

**Solutions:**
1. Check internet connection
2. Verify MongoDB Atlas credentials
3. Check MongoDB Atlas network access (whitelist your IP)
4. Verify database name is correct

### Redis Connection Issues

**Problem:** "Redis client error"

**Solutions:**
1. Verify Upstash Redis URL is correct
2. Check Upstash dashboard for connection limits
3. The app will work without Redis (no caching)

### WebSocket Connection Issues

**Problem:** "WebSocket connection failed"

**Solutions:**
1. Check if backend is running
2. Verify CORS origins include frontend URL
3. Check firewall settings
4. Use polling as fallback transport

### Port Already in Use

**Problem:** "Port 3001 is already in use"

**Solutions:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3002 npm run dev
```

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Amadeus API Documentation](https://developers.amadeus.com/)
- [Paystack API Documentation](https://paystack.com/docs/api/)

## 🎯 Next Steps

1. ✅ Configure environment variables
2. ✅ Start the backend server
3. ✅ Verify database connection
4. ✅ Verify Redis connection
5. ✅ Test API endpoints
6. ✅ Seed initial users
7. ✅ Update frontend to use new backend
8. ✅ Test WebSocket connections
9. ⬜ Deploy to production

## 💡 Pro Tips

1. **Use Mock Data First**: Set `USE_MOCK_DATA=true` to test without external APIs
2. **Monitor Redis Cache**: Check cache hit rates in logs
3. **Rate Limit Exemption**: For development, increase rate limits
4. **Log Levels**: Use `LOG_LEVEL=debug` for detailed debugging
5. **Health Checks**: Set up monitoring with `/health` endpoint

## 🆘 Support

If you encounter issues:

1. Check the logs in `/logs` directory
2. Verify all environment variables are set correctly
3. Ensure MongoDB and Redis are accessible
4. Review the error messages in console
5. Contact the development team

---

**Happy Coding! 🚀**
