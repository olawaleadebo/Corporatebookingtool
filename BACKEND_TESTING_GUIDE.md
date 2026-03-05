# 🧪 Backend Testing Guide

## Quick Testing Overview

This guide will help you verify that the BTMTravel COBT backend is running correctly.

---

## ⚡ Quick Health Check

### Method 1: Use the Built-in Status Monitor (Recommended)

1. **Start the frontend**:
   ```bash
   npm run dev
   ```

2. **Navigate to the Backend Test page**:
   - Open your browser to: http://localhost:5173/backend-test
   - Or click "View Backend Status Monitor" from the login page

3. **Review the status**:
   - 🟢 **Green badges** = Everything working
   - 🔴 **Red badges** = Issues detected
   - Click "Run Tests" to refresh the status

### Method 2: Use curl (Terminal)

```bash
# Basic health check
curl http://localhost:3000/api/v1/health

# Liveness probe
curl http://localhost:3000/api/v1/health/live

# Readiness probe  
curl http://localhost:3000/api/v1/health/ready
```

**Expected Response** (if backend is working):
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "disk": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "disk": {
      "status": "up"
    }
  }
}
```

### Method 3: Check Docker Status

```bash
cd backend

# Check if containers are running
docker-compose ps

# Expected output:
# NAME                   STATUS          PORTS
# cobt-api              Up 2 minutes    0.0.0.0:3000->3000/tcp
# cobt-postgres         Up 2 minutes    0.0.0.0:5432->5432/tcp
# cobt-redis            Up 2 minutes    0.0.0.0:6379->6379/tcp
# cobt-kafka            Up 2 minutes    9092/tcp
# cobt-zookeeper        Up 2 minutes    2181/tcp
```

---

## 📊 Detailed Component Tests

### 1. Test Database Connection

```bash
# Using the health endpoint
curl http://localhost:3000/api/v1/health | jq '.details.database'

# Expected: { "status": "up" }
```

### 2. Test Authentication API

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "traveller",
    "companyId": 1,
    "departmentId": 1
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveller@test.com",
    "password": "Test123!"
  }'
```

### 3. Test Search API

```bash
# Get an access token first (from login response above)
TOKEN="your_access_token_here"

# Search for flights
curl -X POST http://localhost:3000/api/v1/search/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "origin": "LOS",
    "destination": "ABV",
    "departureDate": "2026-04-15",
    "returnDate": "2026-04-20",
    "adults": 1,
    "cabinClass": "ECONOMY"
  }'
```

### 4. Test WebSocket Connection

```bash
# Install wscat if not already installed
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:3000

# You should see: Connected (press CTRL+C to quit)
```

---

## 🔍 Visual Testing with Swagger/OpenAPI

The backend includes interactive API documentation:

1. **Open Swagger UI**: http://localhost:3000/api/docs

2. **Explore endpoints**:
   - Authentication (register, login, refresh)
   - Search (flights, hotels, cars)
   - Bookings (create, list, approve, reject)
   - Payments (initiate, verify)
   - Users (profile, list)
   - Health (status checks)

3. **Test endpoints**:
   - Click on any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - View response

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot connect to server"

**Symptom**: Login page shows red "Backend offline" indicator

**Solution**:
```bash
# Start the backend
cd backend
docker-compose up -d

# Wait 30 seconds for services to initialize
sleep 30

# Verify it's running
curl http://localhost:3000/api/v1/health
```

### Issue 2: "Database not connected"

**Symptom**: Health check shows database status as "down"

**Solution**:
```bash
# Check database container
cd backend
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Issue 3: "401 Unauthorized"

**Symptom**: API calls return 401 errors

**Solution**:
1. Make sure you're logged in first
2. Check that your access token is valid
3. Tokens expire after 15 minutes - login again

---

## 📈 Frontend Integration Testing

### Test Complete Login Flow

1. **Start both frontend and backend**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   docker-compose up -d
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Open frontend**: http://localhost:5173

3. **Check backend status indicator**:
   - Should show green "Backend connected" status
   - If yellow, wait a moment
   - If red, backend isn't running

4. **Test demo login**:
   - Click "Demo Login as Traveller"
   - Should redirect to traveller dashboard
   - Check browser console for errors

5. **Test booking flow**:
   - Click "New Booking"
   - Fill in flight search
   - Verify results load from backend
   - Complete booking flow

---

## 🧪 Automated Testing Scripts

### Health Check Script

Create a file `test-backend.sh`:

```bash
#!/bin/bash

echo "🧪 Testing BTMTravel COBT Backend..."
echo ""

# Test 1: Server reachability
echo "1️⃣ Testing server reachability..."
if curl -s http://localhost:3000/api/v1/health/live > /dev/null; then
    echo "✅ Server is reachable"
else
    echo "❌ Server is not reachable"
    exit 1
fi

# Test 2: Full health check
echo ""
echo "2️⃣ Testing full health check..."
HEALTH=$(curl -s http://localhost:3000/api/v1/health | jq -r '.status')
if [ "$HEALTH" = "ok" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# Test 3: Database connection
echo ""
echo "3️⃣ Testing database connection..."
DB_STATUS=$(curl -s http://localhost:3000/api/v1/health | jq -r '.details.database.status')
if [ "$DB_STATUS" = "up" ]; then
    echo "✅ Database connected"
else
    echo "❌ Database not connected"
    exit 1
fi

# Test 4: API endpoints
echo ""
echo "4️⃣ Testing API endpoints..."
if curl -s http://localhost:3000/api/v1/health/ready > /dev/null; then
    echo "✅ API endpoints responding"
else
    echo "❌ API endpoints not responding"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Backend is running correctly."
```

Run it:
```bash
chmod +x test-backend.sh
./test-backend.sh
```

---

## 📋 Pre-Production Checklist

Before deploying or sharing with clients, verify:

- [ ] Backend starts successfully: `cd backend && docker-compose up -d`
- [ ] Health check returns 200: `curl http://localhost:3000/api/v1/health`
- [ ] Database is connected (health check shows database status "up")
- [ ] All Docker containers are running: `docker-compose ps`
- [ ] No error logs: `docker-compose logs api | grep ERROR`
- [ ] Test accounts exist: `./scripts/create-test-accounts.sh`
- [ ] Login works with test accounts
- [ ] Swagger docs accessible: http://localhost:3000/api/docs
- [ ] Frontend connects successfully (green indicator on login page)
- [ ] Can complete a booking from search to payment

---

## 📚 Additional Resources

- **Backend Setup**: See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **API Testing**: See [backend/API_TESTING.md](./backend/API_TESTING.md)
- **Troubleshooting**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Quick Start**: See [NETWORK_ERROR_FIX.md](./NETWORK_ERROR_FIX.md)

---

## 🎯 Next Steps

Once backend is verified as working:

1. ✅ Test with real user workflows
2. ✅ Configure company branding
3. ✅ Set up production environment variables
4. ✅ Configure external API keys (Amadeus, Paystack)
5. ✅ Review security settings
6. ✅ Set up monitoring and logging
7. ✅ Create backup strategy

---

**Status**: ✅ Backend testing infrastructure ready!
**Last Updated**: March 4, 2026
