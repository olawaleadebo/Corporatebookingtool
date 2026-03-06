# 🎯 COBT Backend - START HERE!

```
 ██████╗ ██████╗ ██████╗ ████████╗
██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝
██║     ██║   ██║██████╔╝   ██║   
██║     ██║   ██║██╔══██╗   ██║   
╚██████╗╚██████╔╝██████╔╝   ██║   
 ╚═════╝ ╚═════╝ ╚═════╝    ╚═╝   

Corporate Booking Tool - Backend API
Version 2.0.0 | MERN Stack
```

---

## 🚀 3-Minute Quick Start

### Step 1: Install (30 seconds)
```bash
cd backend-mern
npm install
```

### Step 2: Start Server (10 seconds)
```bash
npm run dev
```

**That's it!** The `.env` file is already configured with:
- ✅ MongoDB Atlas
- ✅ Upstash Redis
- ✅ ngrok WebSocket support

### Step 3: Verify (30 seconds)
```bash
# Open new terminal
npm run health
```

**Expected output:**
```
✓ Server is running and healthy
✓ API root endpoint accessible
✓ All systems operational
```

---

## 🎊 What You Just Got

### Backend Features (Already Running!)
- ✅ **REST API** - Full booking system with flights, hotels, cars
- ✅ **WebSocket** - Real-time updates via Socket.IO
- ✅ **Redis Cache** - 30-min caching for blazing fast searches
- ✅ **MongoDB Atlas** - Cloud database (no local setup needed)
- ✅ **Mock Data** - Realistic Nigerian travel data
- ✅ **Authentication** - JWT with role-based access
- ✅ **Payment** - Paystack integration ready

### Your Server URLs
```
API:       http://localhost:3001/api/v1
Health:    http://localhost:3001/health
WebSocket: http://localhost:3001
ngrok:     https://chromoplasmic-ungaping-danielle.ngrok-free.dev
```

---

## 📖 Next Steps

### New to the Project?
**→ Read [GETTING_STARTED.md](./GETTING_STARTED.md)** (5 minutes)
- Complete walkthrough
- Test API endpoints
- Success checklist

### Need Quick Commands?
**→ Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** (Bookmark this!)
- All API endpoints
- curl command examples
- Common troubleshooting

### Want Full Details?
**→ Browse [INDEX.md](./INDEX.md)** (Navigation hub)
- Find any documentation
- Learning paths
- Troubleshooting guide

---

## 🧪 Test It Now!

### Test 1: Server Health
```bash
curl http://localhost:3001/health
```

**Should return:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-03-06T..."
}
```

### Test 2: Search Flights
```bash
curl "http://localhost:3001/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-15&adults=1"
```

**Should return:** List of Nigerian flights (₦110,000 - ₦925,000)

### Test 3: Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@btmtravel.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "traveller",
    "department": "Engineering"
  }'
```

**Should return:** User created with JWT token

---

## 📚 Documentation Map

```
START_HERE.md ← You are here!
    │
    ├─→ GETTING_STARTED.md ...... Quick start guide (5 min)
    │
    ├─→ QUICK_REFERENCE.md ....... Command cheat sheet
    │
    ├─→ INDEX.md ................. Full documentation index
    │
    ├─→ SETUP_GUIDE.md ........... Detailed configuration
    │
    ├─→ README.md ................ Complete API docs
    │
    ├─→ ARCHITECTURE.md .......... System architecture
    │
    └─→ IMPLEMENTATION_SUMMARY.md  What was built
```

---

## ⚙️ Already Configured For You

### ✅ MongoDB Atlas
```
Database: corporatetest
Collections: users, bookings, payments (auto-created)
Status: Connected and ready
```

### ✅ Upstash Redis
```
Cache Duration: 30 minutes
Cached: Flights, Hotels, Cars
Status: Connected and ready
```

### ✅ WebSocket (Socket.IO)
```
Local: http://localhost:3001
External: https://chromoplasmic-ungaping-danielle.ngrok-free.dev
Events: booking:updated, payment:updated
Status: Active and ready
```

### ✅ Environment Variables
All secrets and configurations are in `.env` file (already set!)

---

## 🎯 What Can You Build?

### Travel Booking System
- ✅ Search flights (Lagos ↔ Abuja, etc.)
- ✅ Search hotels (Nigerian cities)
- ✅ Rent cars (Compact to Luxury)
- ✅ Create complete bookings
- ✅ Approval workflow
- ✅ Payment processing

### User Roles
- **Traveller** - Create and view bookings
- **Travel Arranger** - Approve/reject bookings
- **Admin** - Full access + refunds

### Real Features
- JWT authentication
- Role-based access control
- Real-time WebSocket updates
- Redis caching for performance
- Mock Nigerian travel data
- Amadeus API integration ready
- Paystack payment ready

---

## 🔥 Pro Developer Tips

### 1. Use Mock Data First
```env
# In .env file (already set)
USE_MOCK_DATA=true
```
Test everything without external API keys!

### 2. Enable Debug Logging
```env
# In .env file
LOG_LEVEL=debug
```
See every request and response.

### 3. Monitor Your Cache
Watch logs for cache HIT/MISS to see Redis working!

### 4. Use Health Check
```bash
npm run health
```
Verify all services are connected.

### 5. Check the Logs
```bash
tail -f logs/combined.log
```
See real-time activity.

---

## ✨ The Technology

```
Runtime:     Node.js 18+ + TypeScript
Framework:   Express.js
Database:    MongoDB (via Mongoose ODM)
Cache:       Redis (via ioredis)
WebSocket:   Socket.IO
APIs:        Amadeus, Paystack
Security:    JWT, bcrypt, Helmet, CORS
Logging:     Winston
```

---

## 🆘 Having Issues?

### Server won't start?
1. Check Node version: `node --version` (need 18+)
2. Clear and reinstall: `rm -rf node_modules && npm install`
3. Check port: `lsof -i :3001` (kill if in use)

### MongoDB connection error?
1. Check internet connection
2. The connection string is pre-configured
3. Should work out of the box

### Redis connection warning?
Don't worry! App works without Redis (just no caching)

### Need more help?
**→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** has troubleshooting section

---

## 📊 Success Checklist

After running `npm run dev`, you should see:

- [ ] ✅ "MongoDB connected successfully"
- [ ] ✅ "Redis client connected successfully"  
- [ ] ✅ "Server is running on port 3001"
- [ ] ✅ No error messages

Run `npm run health` and verify:

- [ ] ✅ "Server is running and healthy"
- [ ] ✅ "All systems operational"
- [ ] ✅ MongoDB: Configured
- [ ] ✅ Redis: Configured
- [ ] ✅ WebSocket: Enabled

---

## 🎓 Learning Path

### Beginner (New to Project)
1. ✅ Complete this quick start
2. → Read [GETTING_STARTED.md](./GETTING_STARTED.md)
3. → Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. → Test API endpoints
5. → Build something!

### Intermediate (Setting up Development)
1. → Review [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. → Understand [ARCHITECTURE.md](./ARCHITECTURE.md)
3. → Study [README.md](./README.md)
4. → Connect your frontend

### Advanced (Deploying/Contributing)
1. → Deep dive [ARCHITECTURE.md](./ARCHITECTURE.md)
2. → Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
3. → Check [CHANGELOG.md](./CHANGELOG.md)
4. → Deploy to production

---

## 🎉 You're Ready!

The COBT Backend is now running with:
- ✅ Cloud MongoDB database
- ✅ Cloud Redis cache
- ✅ WebSocket support
- ✅ Full REST API
- ✅ Mock Nigerian travel data
- ✅ Ready for frontend integration

**Your server is live at:** `http://localhost:3001`

---

## 🚀 What's Next?

### Option 1: Test the API
Use the curl commands above or tools like Postman

### Option 2: Read Documentation
Start with [GETTING_STARTED.md](./GETTING_STARTED.md)

### Option 3: Connect Frontend
Update frontend to use `http://localhost:3001/api/v1`

### Option 4: Explore Code
Check out `/src` folder to see the implementation

---

## 💡 Remember

1. **Documentation is your friend** - Check [INDEX.md](./INDEX.md) anytime
2. **Health check is your safety net** - Run `npm run health` often
3. **Logs are your eyes** - Check `logs/combined.log` for details
4. **Mock data is your playground** - Test without real API keys
5. **Community is your support** - Contact the team if stuck

---

## 📞 Get Help

- Documentation: [INDEX.md](./INDEX.md)
- Quick Reference: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- Troubleshooting: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Team: Contact BTMTravel development

---

```
┌────────────────────────────────────────────┐
│                                             │
│     🎊 Welcome to COBT Backend! 🎊         │
│                                             │
│   You're all set to build amazing          │
│   corporate travel booking features!       │
│                                             │
│   Happy Coding! 💻                          │
│                                             │
└────────────────────────────────────────────┘
```

**Created with ❤️ by BTMTravel Development Team**

---

**Last Updated:** March 6, 2026
**Version:** 2.0.0
**Status:** Production Ready ✅
