# 🚀 Getting Started with COBT MERN Backend

Welcome! This guide will help you get the backend up and running in just a few minutes.

## Prerequisites Checklist

- ✅ Node.js 18+ installed
- ✅ npm 9+ installed
- ✅ Internet connection (for MongoDB Atlas and Upstash Redis)

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd backend-mern
npm install
```

This will install all required packages including:
- Express.js
- Mongoose (MongoDB ODM)
- Socket.IO (WebSocket)
- ioredis (Redis client)
- And many more...

### Step 2: Environment Configuration

**Good news!** The `.env` file is already configured with:
- ✅ MongoDB Atlas connection
- ✅ Upstash Redis connection
- ✅ ngrok URL for WebSocket
- ✅ All necessary settings

**You can start immediately!** No additional configuration needed.

If you want to customize, edit `.env`:

```bash
# Example customizations
PORT=3002  # Change server port
JWT_SECRET=your-custom-secret  # Change JWT secret
CORS_ORIGIN=http://localhost:3000  # Change frontend URL
```

### Step 3: Start the Server

```bash
npm run dev
```

You should see:

```
MongoDB connected successfully
Redis client connected successfully
Server is running on port 3001
```

### Step 4: Verify It's Working

Open a new terminal and run:

```bash
npm run health
```

You should see:

```
🏥 COBT Backend Health Check

ℹ Checking server status...
✓ Server is running and healthy
ℹ Timestamp: 2026-03-06T...

ℹ Checking API root endpoint...
✓ API root endpoint accessible
ℹ Version: v1
ℹ Message: Welcome to COBT Backend API - MERN Stack

📊 Health Check Summary

✓ All systems operational
ℹ Server URL: http://localhost:3001
ℹ Environment: development
ℹ MongoDB: Configured
ℹ Redis: Configured
ℹ WebSocket: Enabled
ℹ ngrok URL: https://chromoplasmic-ungaping-danielle.ngrok-free.dev
```

## 🎉 That's It!

Your backend is now running with:

- ✅ MongoDB Atlas (Cloud Database)
- ✅ Upstash Redis (Cloud Cache)
- ✅ WebSocket Support
- ✅ Mock Data Fallback
- ✅ Full API Endpoints
- ✅ JWT Authentication

## 📡 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3001/health

# Register a user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@btmtravel.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "role": "traveller",
    "department": "Engineering"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@btmtravel.com",
    "password": "Test123!@#"
  }'

# Search flights (with auth token)
curl "http://localhost:3001/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-15&adults=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API collection (if available)
2. Set base URL: `http://localhost:3001/api/v1`
3. Test endpoints following the API documentation

## 🔗 Connecting Your Frontend

In your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WEBSOCKET_URL=http://localhost:3001
```

Then update your API client to use this URL.

## 🐛 Troubleshooting

### Server Won't Start

**Problem:** Port 3001 is already in use

**Solution:**
```bash
# Kill the process using port 3001
lsof -i :3001
kill -9 <PID>

# Or use a different port
PORT=3002 npm run dev
```

### MongoDB Connection Error

**Problem:** "MongoDB connection failed"

**Solution:**
- Check your internet connection
- Verify the MongoDB URI in `.env` is correct
- The connection string is already configured, should work out of the box

### Redis Connection Warning

**Problem:** "Redis client error"

**Solution:**
- Don't worry! The app works without Redis (just no caching)
- Check Upstash dashboard if you want to verify connection
- Verify the Redis URL in `.env`

### Dependencies Installation Issues

**Problem:** npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📚 What's Next?

1. **Seed the Database**
   ```bash
   npm run seed
   ```
   This creates initial test users.

2. **Explore the API**
   - Check out the API endpoints in `/api/v1`
   - Read the full API documentation in `README.md`

3. **Configure External APIs**
   - Add Amadeus API credentials for real flight data
   - Add Paystack credentials for real payments
   - Or keep using mock data (works perfectly!)

4. **Monitor the Application**
   - Check logs in `/logs` directory
   - Monitor MongoDB in Atlas dashboard
   - Monitor Redis in Upstash dashboard

5. **Deploy to Production**
   - Build: `npm run build`
   - Deploy to your hosting platform
   - Update environment variables for production

## 🎯 Key Features Already Working

### 1. Search API with Redis Caching
- Flight search: 30-minute cache
- Hotel search: 30-minute cache
- Car search: 30-minute cache
- **Benefit:** Faster responses, reduced API calls

### 2. WebSocket Real-time Updates
- Booking status changes
- Payment status changes
- **Benefit:** Live updates without polling

### 3. Mock Data Fallback
- Nigerian flights (₦110,000 - ₦925,000)
- Nigerian hotels (₦55,000 - ₦360,000)
- Car rentals (₦15,000 - ₦65,000/day)
- **Benefit:** Works without external API keys

### 4. Multi-role Authentication
- Traveller: Create bookings
- Travel Arranger: Approve/reject bookings
- Admin: Full access + refunds
- **Benefit:** Complete approval workflow

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation

## 📞 Support

Need help? Check these resources:

1. **Documentation**
   - `README.md` - Complete API documentation
   - `SETUP_GUIDE.md` - Detailed setup instructions
   - `MIGRATION_FROM_NESTJS.md` - Migration guide

2. **Logs**
   - Console output
   - `logs/combined.log`
   - `logs/error.log`

3. **Health Check**
   ```bash
   npm run health
   ```

4. **Development Team**
   - Contact BTMTravel development team

## 🎊 Success Checklist

Before moving forward, verify:

- [ ] Server starts without errors
- [ ] Health check passes
- [ ] MongoDB shows "connected successfully"
- [ ] Redis shows "connected successfully"
- [ ] Can register a new user
- [ ] Can login and receive JWT token
- [ ] Can search for flights
- [ ] WebSocket connects (check frontend)

If all items are checked, you're ready to go! 🚀

## 💡 Pro Tips

1. **Development Workflow**
   ```bash
   # Terminal 1: Run backend
   npm run dev
   
   # Terminal 2: Watch logs
   tail -f logs/combined.log
   
   # Terminal 3: Test API
   curl http://localhost:3001/health
   ```

2. **Quick Test Cycle**
   - Make code changes
   - Server auto-reloads (ts-node-dev)
   - Test with curl or Postman
   - Check logs for issues

3. **Debugging**
   - Set `LOG_LEVEL=debug` in `.env`
   - Check `logs/error.log` for errors
   - Use console.log in your code
   - TypeScript will show type errors

4. **Performance**
   - Redis caching speeds up repeated searches
   - Mock data returns instantly
   - WebSocket reduces HTTP overhead
   - Compression enabled for responses

---

**You're all set! Happy coding! 🎉**

If you have any questions, refer to the documentation or contact the team.
