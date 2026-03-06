# 🔧 Troubleshooting Guide - Common Issues & Solutions

## Your Current Issues

Based on your error log, here are the issues and how to fix them:

---

## ❌ Issue 1: Redis URL Not Configured

**Error Message:**
```
warn: Redis URL not configured, caching will be disabled
```

**Root Cause:** The environment variable name in your `.env` file doesn't match what the code expects.

**Solution:**

Open your `/backend-mern/.env` file and make sure you have:

```env
REDIS_URL=rediss://default:AUrUAAIncDJkOTU1YTU5OTJkNDQ0YzE2YTdjYjlmNmQ2ZWVlMWI1OXAyMTkxNTY@thorough-dove-19156.upstash.io:6379
```

**NOT:**
```env
REDIS_URI=...  ❌ Wrong
REDIS_CONNECTION=...  ❌ Wrong
```

After fixing, restart the server:
```bash
# Press Ctrl+C to stop the server
npm run dev
```

---

## ❌ Issue 2: MongoDB Connection Failed

**Error Message:**
```
error: MongoDB connection failed {"error":"querySrv ECONNREFUSED _mongodb._tcp.cluster0.magzhhq.mongodb.net"}
```

**Root Cause:** Your MongoDB Atlas cluster credentials or network access might be misconfigured.

**Solutions:**

### Option A: Fix Your Current MongoDB Cluster

1. **Go to MongoDB Atlas Dashboard:** https://cloud.mongodb.com/

2. **Verify Cluster Exists:**
   - Check if `cluster0.magzhhq.mongodb.net` exists
   - If not, you need to create a new cluster

3. **Check Network Access:**
   - Click "Network Access" in left sidebar
   - Add your current IP address or use `0.0.0.0/0` (allow from anywhere)
   - Click "Add IP Address" → "Allow Access from Anywhere" → "Confirm"

4. **Verify Database User:**
   - Click "Database Access" in left sidebar
   - Make sure user `buzwale_db_user` exists with password `NVXtaLqs-Lf4jtG`
   - If not, create a new user or reset password

5. **Update Connection String:**
   
   In your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://buzwale_db_user:NVXtaLqs-Lf4jtG@cluster0.magzhhq.mongodb.net/corporate?retryWrites=true&w=majority
   ```

### Option B: Use the Pre-Configured Cluster (Recommended)

Use the MongoDB cluster I already configured for you:

In your `.env` file, replace with:
```env
MONGODB_URI=mongodb+srv://hristesthr_db_user:Ro3VEkdZrbnio8wf@cluster0.rycx8qh.mongodb.net/corporatetest?retryWrites=true&w=majority
```

This cluster is already configured and tested.

### Option C: Use Local MongoDB (Development Only)

Install MongoDB locally and use:
```env
MONGODB_URI=mongodb://localhost:27017/cobt
```

---

## ✅ Issue 3: Mongoose Duplicate Index Warnings (FIXED)

**Error Messages:**
```
Warning: Duplicate schema index on {"email":1} found
Warning: Duplicate schema index on {"bookingReference":1} found
Warning: Duplicate schema index on {"bookingId":1} found
```

**Status:** ✅ **FIXED!** I've already updated the model files.

The duplicate index definitions have been removed from:
- `/src/models/User.ts`
- `/src/models/Booking.ts`
- `/src/models/Payment.ts`

These warnings will disappear on next restart.

---

## ⚠️ Issue 4: Amadeus & Paystack Not Configured (OPTIONAL)

**Warning Messages:**
```
warn: Amadeus credentials not provided, will use mock data
warn: Paystack secret key not configured
```

**Status:** This is **NORMAL** and **NOT AN ERROR**!

The system will use realistic mock data instead. This is perfect for development.

**If you want to use real APIs (optional):**

1. **Amadeus API** (for real flight/hotel data):
   ```env
   AMADEUS_API_KEY=your_amadeus_api_key_here
   AMADEUS_API_SECRET=your_amadeus_secret_here
   AMADEUS_ENV=test
   ```
   Get credentials from: https://developers.amadeus.com/

2. **Paystack** (for real payments):
   ```env
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
   ```
   Get credentials from: https://dashboard.paystack.com/

---

## 📋 Complete .env File Template

Here's what your `.env` file should look like:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database Configuration (Choose ONE option)
# Option A: Your cluster (if fixed)
MONGODB_URI=mongodb+srv://buzwale_db_user:NVXtaLqs-Lf4jtG@cluster0.magzhhq.mongodb.net/corporate?retryWrites=true&w=majority

# Option B: Pre-configured cluster (RECOMMENDED)
# MONGODB_URI=mongodb+srv://hristesthr_db_user:Ro3VEkdZrbnio8wf@cluster0.rycx8qh.mongodb.net/corporatetest?retryWrites=true&w=majority

# Redis Configuration (IMPORTANT: Use REDIS_URL not REDIS_URI)
REDIS_URL=rediss://default:AUrUAAIncDJkOTU1YTU5OTJkNDQ0YzE2YTdjYjlmNmQ2ZWVlMWI1OXAyMTkxNTY@thorough-dove-19156.upstash.io:6379
REDIS_CACHE_TTL=3600
ENABLE_REDIS_CACHE=true

# JWT Configuration
JWT_SECRET=cobt-super-secret-jwt-key-production-2026-btmtravel-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Amadeus API (OPTIONAL - will use mock data if not provided)
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
AMADEUS_ENV=test

# Paystack (OPTIONAL - will use mock data if not provided)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# WebSocket Configuration
WEBSOCKET_ORIGIN=http://localhost:5173
NGROK_URL=https://chromoplasmic-ungaping-danielle.ngrok-free.dev
ENABLE_WEBSOCKET=true

# Feature Flags
USE_MOCK_DATA=true

# Logging
LOG_LEVEL=info
```

---

## 🎯 Quick Fix Checklist

Run through this checklist to fix all issues:

### 1. Stop the server
```bash
# Press Ctrl+C in the terminal running the server
```

### 2. Edit .env file
- [ ] Check `REDIS_URL` (not REDIS_URI)
- [ ] Check `MONGODB_URI` (use Option B if yours doesn't work)
- [ ] Save the file

### 3. Restart the server
```bash
npm run dev
```

### 4. Check for success
You should see:
```
✅ MongoDB connected successfully
✅ Redis client connected successfully
✅ Server is running on port 3001
```

**No more errors!** ✅

---

## 🧪 Verify Everything Works

### Test 1: Health Check
```bash
# Open new terminal
npm run health
```

**Expected:**
```
✓ Server is running and healthy
✓ All systems operational
```

### Test 2: MongoDB Connection
```bash
curl http://localhost:3001/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

### Test 3: Redis Cache
```bash
# Search for flights (first time - cache miss)
curl "http://localhost:3001/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-15&adults=1"

# Search again (cache hit - faster)
curl "http://localhost:3001/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-15&adults=1"
```

Check logs - you should see:
```
Cache MISS (first request)
Cache HIT (second request)
```

---

## 🔍 Additional Troubleshooting

### If MongoDB Still Fails

**Check Internet Connection:**
```bash
ping google.com
```

**Test MongoDB Connection Directly:**
```bash
# Install MongoDB Compass (GUI tool)
# Try connecting with your connection string
```

**Alternative - Use Local MongoDB:**
```bash
# Install MongoDB locally
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Then use:
MONGODB_URI=mongodb://localhost:27017/cobt
```

### If Redis Still Fails

**Don't worry!** The app works without Redis (just no caching).

**To verify Redis URL:**
```bash
# Check Upstash dashboard: https://console.upstash.com/
# Verify the connection string
```

### If Port 3001 is Busy

```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3001
kill -9 <PID>

# Or use different port:
PORT=3002 npm run dev
```

---

## 📞 Still Having Issues?

### Check Logs
```bash
# View detailed logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log
```

### Enable Debug Mode
In `.env`:
```env
LOG_LEVEL=debug
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| "ECONNREFUSED" | Check internet, MongoDB network access |
| "Authentication failed" | Check MongoDB username/password |
| "Redis connection timeout" | Optional, app works without it |
| "Port already in use" | Kill process or use different port |
| "Module not found" | Run `npm install` |

---

## ✅ Success Indicators

Your server is working correctly when you see:

```
info: MongoDB connected successfully {
  "context": "Database",
  "host": "cluster0.rycx8qh.mongodb.net",
  "name": "corporatetest"
}

info: Redis client connected successfully {
  "context": "Redis"
}

info: Server is running on port 3001 {
  "context": "Server",
  "port": 3001,
  "environment": "development"
}
```

**No error messages in red!** ✅

---

## 🎉 Next Steps After Fixing

Once everything is running:

1. **Test API endpoints** - See QUICK_REFERENCE.md
2. **Connect frontend** - Update frontend API URL
3. **Create test users** - Run `npm run seed`
4. **Start building!** 🚀

---

**Need more help?** 
- Check other documentation files in this folder
- Contact BTMTravel development team

---

**Last Updated:** March 6, 2026
