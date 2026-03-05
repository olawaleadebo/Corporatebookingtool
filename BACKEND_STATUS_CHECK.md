# ✅ Backend Status Check - Quick Reference

## 🎯 Purpose

This guide helps you verify that the BTMTravel COBT backend is running correctly before using the application.

---

## ⚡ 3 Ways to Test Backend

### Method 1: Automated Script (⭐ Recommended)

**Fastest way to verify everything is working:**

```bash
chmod +x test-backend.sh
./test-backend.sh
```

**What it tests:**
- ✅ Server reachability
- ✅ Health endpoint status
- ✅ Database connection
- ✅ Memory and disk health
- ✅ Docker container status

**Expected output:**
```
✅ ALL TESTS PASSED! 🎉
Backend is running correctly
```

---

### Method 2: Visual Status Monitor (🎨 Interactive)

**Best for visual debugging:**

1. Start frontend: `npm run dev`
2. Open: http://localhost:5173/backend-test
3. Click "Run Tests"

**Features:**
- Real-time health monitoring
- Green/yellow/red status indicators
- Detailed error messages
- Quick troubleshooting tips
- Links to documentation

---

### Method 3: Manual Terminal Check (🔧 Advanced)

**Quick curl commands:**

```bash
# Test 1: Is server alive?
curl http://localhost:3000/api/v1/health/live

# Test 2: Full health check
curl http://localhost:3000/api/v1/health

# Test 3: Is API ready?
curl http://localhost:3000/api/v1/health/ready

# Test 4: View in browser
open http://localhost:3000/api/v1/health
```

---

## 🚨 Quick Troubleshooting

### Backend Not Running?

**Symptoms:**
- ❌ Login page shows red "Backend offline" indicator
- ❌ curl commands fail
- ❌ Test script shows "Server not reachable"

**Solution:**

```bash
# Start the backend
cd backend
docker-compose up -d

# Wait 30 seconds
sleep 30

# Verify it's running
curl http://localhost:3000/api/v1/health
```

---

### Database Not Connected?

**Symptoms:**
- ⚠️ Health check shows database status "down"
- ⚠️ Login returns database errors

**Solution:**

```bash
cd backend

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Verify
curl http://localhost:3000/api/v1/health | grep database
```

---

### Port Already in Use?

**Symptoms:**
- ❌ "Port 3000 is already in use"
- ❌ Backend won't start

**Solution:**

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Or use a different port in backend/.env
PORT=3001
```

---

## 📊 Understanding Health Check Response

A healthy backend returns:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "disk": { "status": "up" }
  }
}
```

**All indicators should be "up"**

---

## 🔍 Login Page Indicators

The login page shows real-time backend status:

| Indicator | Meaning | Action |
|-----------|---------|--------|
| 🟢 Green check | Backend connected | Ready to login ✓ |
| 🟡 Yellow pulse | Checking connection | Wait a moment |
| 🔴 Red warning | Backend offline | Start backend |

---

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:3000 | REST API |
| API Docs | http://localhost:3000/api/docs | Swagger UI |
| Health Check | http://localhost:3000/api/v1/health | Status endpoint |
| Status Monitor | http://localhost:5173/backend-test | Visual tester |

---

## ✅ Pre-Flight Checklist

Before testing the application:

- [ ] Docker is running: `docker --version`
- [ ] Backend is started: `cd backend && docker-compose ps`
- [ ] All containers are "Up": Check status column
- [ ] Health check passes: `curl http://localhost:3000/api/v1/health`
- [ ] Frontend connects: Green indicator on login page
- [ ] Test accounts exist: Run `./scripts/create-test-accounts.sh`

---

## 🎯 Next Steps After Verification

Once backend is confirmed working:

1. ✅ Test login with demo accounts
2. ✅ Try the booking flow
3. ✅ Check real-time notifications
4. ✅ Review API documentation
5. ✅ Configure company branding (Admin panel)

---

## 📚 Full Documentation

For detailed information, see:

- **[BACKEND_TESTING_GUIDE.md](./BACKEND_TESTING_GUIDE.md)** - Complete testing guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Fix common issues
- **[README.md](./README.md)** - Main documentation
- **[backend/README.md](./backend/README.md)** - Backend specifics

---

## 🎬 Quick Start Workflow

**Complete startup in 60 seconds:**

```bash
# 1. Start backend (30 seconds)
cd backend && docker-compose up -d && cd ..

# 2. Wait for services
sleep 30

# 3. Run health check (5 seconds)
./test-backend.sh

# 4. Start frontend (10 seconds)
npm run dev

# 5. Open browser
# Visit: http://localhost:5173
# Click: "Demo Login as Traveller"
```

---

## 💡 Pro Tips

1. **Bookmark the status monitor**: http://localhost:5173/backend-test
2. **Keep backend running**: Don't stop Docker containers while developing
3. **Check health first**: Always verify backend before debugging frontend
4. **Use demo logins**: Fastest way to test different user roles
5. **Monitor logs**: `cd backend && docker-compose logs -f api`

---

**Status**: ✅ Backend testing infrastructure ready!  
**Updated**: March 4, 2026  
**Version**: 1.0.0
