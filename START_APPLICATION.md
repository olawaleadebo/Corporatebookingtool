# 🚀 Start BTMTravel COBT Application

## ⚡ Quick Start (Fastest Way)

```bash
# 1. Start backend
cd backend && docker-compose up -d && cd ..

# 2. Wait 30 seconds for services...

# 3. Start frontend
npm run dev
```

**Open:** http://localhost:5173

---

## 📋 Step-by-Step Instructions

### Step 1: Start Backend Services

The backend includes PostgreSQL, Kafka, and the NestJS API.

```bash
# Navigate to backend directory
cd backend

# Start all services with Docker
docker-compose up -d

# Go back to project root
cd ..
```

**Wait ~30 seconds** for all services to initialize.

### Step 2: Verify Backend is Running

```bash
# Check backend health
curl http://localhost:3000/api/v1/health
```

**Expected response:**
```json
{
  "status": "ok",
  "info": {
    "database": {"status": "up"},
    "kafka": {"status": "up"}
  }
}
```

If you get an error, wait a bit longer or check logs:
```bash
cd backend && docker-compose logs -f app
```

### Step 3: Start Frontend

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will start at: **http://localhost:5173**

### Step 4: Access Application

1. Open browser: **http://localhost:5173**
2. Click one of the demo login buttons:
   - **Demo Login as Traveller** - Search and book flights
   - **Demo Login as Travel Arranger** - Approve bookings
   - **Demo Login as Admin** - Manage policies & users

---

## 🔍 Verify Everything is Working

### Check System Status
Visit: **http://localhost:5173/system-status**

This page shows:
- ✅ Backend API status
- ✅ Database connection
- ✅ Kafka broker status
- ✅ Configuration details

### Check All Services

```bash
# Backend health
curl http://localhost:3000/api/v1/health

# Docker containers
cd backend && docker-compose ps

# Should show:
# - backend-app-1        (Up)
# - backend-postgres-1   (Up)
# - backend-kafka-1      (Up)
# - backend-zookeeper-1  (Up)
```

---

## 🛠️ Troubleshooting

### Backend Not Starting?

```bash
# Check Docker logs
cd backend
docker-compose logs -f

# Look for errors in the output
```

**Common issues:**
- **Port 3000 in use:** `lsof -i :3000` (kill the process)
- **Port 5432 in use:** PostgreSQL already running
- **Docker not running:** Start Docker Desktop

### Frontend Shows "Backend Not Reachable"?

1. **Check backend:** `curl http://localhost:3000/api/v1/health`
2. **Check .env file:** `cat .env` (should have `VITE_API_URL=http://localhost:3000/api/v1`)
3. **Restart frontend:** Stop (Ctrl+C) and `npm run dev` again

### Still Having Issues?

Run the automated check:
```bash
chmod +x check-backend.sh
./check-backend.sh
```

Or see detailed troubleshooting: [BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md)

---

## 🔑 Demo Accounts

The system uses demo accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Traveller | traveller@test.com | Test123! |
| Travel Arranger | arranger@test.com | Test123! |
| Admin | admin@test.com | Test123! |

Just click the demo buttons on the login page - no need to type!

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| System Status | http://localhost:5173/system-status |
| Backend Test | http://localhost:5173/backend-test |
| Backend API | http://localhost:3000/api/v1 |
| Health Check | http://localhost:3000/api/v1/health |
| API Documentation | http://localhost:3000/api/docs |

---

## 🎯 What Can You Do?

### As Traveller
1. Search for flights (Lagos → Abuja, etc.)
2. Select a flight
3. Add hotel (optional)
4. Add car rental (optional)
5. Review booking summary
6. Submit for approval

### As Travel Arranger
1. View approval queue
2. Review booking requests
3. Approve or reject bookings
4. Check policy compliance

### As Admin
1. Manage company policies
2. View all bookings
3. Manage users
4. Configure settings

---

## 📊 Application Flow

```
Search → Select Flight → Add Hotel → Add Car → Review → Submit
                                                          ↓
                                                      Approval
                                                          ↓
                                                      Payment
                                                          ↓
                                                    Confirmation
```

---

## 🛑 Stopping the Application

### Stop Frontend
Press **Ctrl+C** in the terminal running `npm run dev`

### Stop Backend
```bash
cd backend
docker-compose down

# Or to completely remove data:
docker-compose down -v
```

---

## 🔄 Restarting Services

### Restart Backend Only
```bash
cd backend
docker-compose restart
```

### Complete Fresh Start
```bash
cd backend
docker-compose down -v
docker-compose up -d
cd ..
npm run dev
```

---

## 📚 Additional Documentation

- **Quick Start Guide:** [QUICK_START.md](./QUICK_START.md)
- **Backend Setup:** [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Troubleshooting:** [BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md)
- **Testing Guide:** [BACKEND_TESTING_GUIDE.md](./BACKEND_TESTING_GUIDE.md)
- **Fix Summary:** [ERRORS_FIXED.md](./ERRORS_FIXED.md)

---

## ✅ Success Checklist

Before you can use the application, verify:

- [x] Docker is running
- [x] Backend started: `docker-compose ps` shows all "Up"
- [x] Health check responds: `curl http://localhost:3000/api/v1/health`
- [x] Frontend running: `npm run dev` with no errors
- [x] Browser opens: http://localhost:5173
- [x] No "Backend not reachable" alerts
- [x] Can click demo login buttons

---

## 🆘 Need Help?

1. **Check System Status:** http://localhost:5173/system-status
2. **Run Health Check:** `./check-backend.sh`
3. **View Logs:** `cd backend && docker-compose logs -f`
4. **Read Docs:** [BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md)

---

## 🎉 You're Ready!

Once you see the login page with demo buttons and "Backend connected" status:

1. Click **"Demo Login as Traveller"**
2. Start searching for flights!
3. Enjoy the BTMTravel Corporate Booking Tool

---

*All errors have been fixed. The application is ready to use!*
