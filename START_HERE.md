# 🔴 BACKEND NOT RUNNING - START IT NOW!

## The Problem

You're seeing this error because **the backend server is not running**:
```
Network Error - Backend not reachable
```

## ⚡ Quick Fix (2 Commands)

### Option 1: Automated Script (Recommended)

```bash
# Make script executable and run it
chmod +x start-backend.sh
./start-backend.sh

# Then start frontend in a new terminal
npm run dev
```

### Option 2: Manual Start

```bash
# Terminal 1: Start Backend
cd backend
docker-compose up -d

# Wait 30 seconds, then create accounts
sleep 30
chmod +x scripts/create-test-accounts.sh
./scripts/create-test-accounts.sh

# Terminal 2: Start Frontend
npm run dev
```

---

## ✅ How to Verify It's Working

### 1. Check Backend Health

```bash
curl http://localhost:3000/api/v1/health
```

**Expected Output:**
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

### 2. Check Login Page

Open http://localhost:5173 in your browser.

**You should see:**
- 🟢 **"Backend connected"** (green checkmark)
- Demo login buttons enabled

**If you see:**
- 🔴 **"Backend offline"** → Backend not started yet
- 🟡 **"Checking..."** → Wait a moment

---

## 📋 Step-by-Step First Time Setup

### Prerequisites

You need these installed:
- ✅ [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- ✅ [Node.js](https://nodejs.org/) (v18 or higher)

### Setup Process

#### Step 1: Start Backend

```bash
# Navigate to project root
cd /path/to/cobt

# Run the startup script
chmod +x start-backend.sh
./start-backend.sh
```

**What this does:**
- Checks prerequisites (Docker, Node.js)
- Creates `.env` file if needed
- Starts Docker containers (PostgreSQL, Kafka, Redis, API)
- Waits for services to be ready
- Creates test accounts automatically

**Time:** ~2 minutes

#### Step 2: Start Frontend

Open a **new terminal** window:

```bash
# Make sure you're in project root
cd /path/to/cobt

# Start frontend dev server
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Step 3: Login

1. Open browser to http://localhost:5173
2. Wait for 🟢 "Backend connected" indicator
3. Click **"Demo Login as Traveller"**
4. You're in! 🎉

---

## 🎯 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Traveller** | traveller@test.com | Test123! |
| **Travel Arranger** | arranger@test.com | Test123! |
| **Admin** | admin@test.com | Test123! |

---

## 🐛 Troubleshooting

### Issue: "Docker command not found"

**Solution:** Install Docker Desktop
- Mac: https://docs.docker.com/desktop/mac/install/
- Windows: https://docs.docker.com/desktop/windows/install/
- Linux: https://docs.docker.com/engine/install/

### Issue: "Port 3000 already in use"

**Solution:** Kill the process using port 3000

```bash
# Find process
lsof -i :3000

# Kill it (replace PID)
kill -9 PID
```

Or change the port in `backend/.env`:
```bash
PORT=3001
```

Then update frontend `.env`:
```bash
VITE_API_URL=http://localhost:3001/api/v1
```

### Issue: "Permission denied on script"

**Solution:** Make script executable

```bash
chmod +x start-backend.sh
chmod +x backend/scripts/create-test-accounts.sh
```

### Issue: Backend shows "offline" after starting

**Solution:** Wait 30-60 seconds for services to start, then click "Retry"

Or manually check:
```bash
# View logs
cd backend
docker-compose logs -f api

# Check container status
docker-compose ps
```

### Issue: "Database connection error"

**Solution:** PostgreSQL container might not be ready

```bash
# Restart PostgreSQL
cd backend
docker-compose restart postgres

# Wait 10 seconds
sleep 10

# Restart API
docker-compose restart api
```

### Nuclear Option: Start Fresh

```bash
cd backend

# Stop and remove everything
docker-compose down -v

# Remove Docker images (optional)
docker system prune -a

# Start fresh
docker-compose up -d

# Wait 30 seconds
sleep 30

# Create test accounts
./scripts/create-test-accounts.sh
```

---

## 📊 Service Architecture

```
┌─────────────────────────────────┐
│  Frontend (Vite + React)        │
│  Port: 5173                     │
└────────────┬────────────────────┘
             │
             │ HTTP/WebSocket
             ▼
┌─────────────────────────────────┐
│  Backend API (NestJS)           │
│  Port: 3000                     │
└────┬────┬────┬────┬─────────────┘
     │    │    │    │
     ▼    ▼    ▼    ▼
   ┌──┐ ┌──┐ ┌──┐ ┌────┐
   │PG│ │KF│ │RD│ │ WS │
   └──┘ └──┘ └──┘ └────┘
   5432 9092 6379 Socket
```

**Services:**
- **PostgreSQL** (Port 5432): Database
- **Kafka** (Port 9092): Message queue
- **Redis** (Port 6379): Cache & sessions
- **API** (Port 3000): NestJS backend
- **Frontend** (Port 5173): React app

---

## ✅ Verification Checklist

After running `start-backend.sh`:

- [ ] Backend script completed without errors
- [ ] `curl http://localhost:3000/api/v1/health` returns JSON
- [ ] `docker-compose ps` shows all services running
- [ ] Frontend shows 🟢 "Backend connected"
- [ ] Demo login buttons are enabled
- [ ] Can click demo login and see dashboard

---

## 🚀 Quick Commands Reference

```bash
# Check if backend is running
curl http://localhost:3000/api/v1/health

# View backend logs
cd backend && docker-compose logs -f api

# Check container status
cd backend && docker-compose ps

# Stop backend
cd backend && docker-compose down

# Start backend
cd backend && docker-compose up -d

# Restart API only
cd backend && docker-compose restart api

# View all logs
cd backend && docker-compose logs -f
```

---

## 📱 What You Should See

### Terminal Output (Backend Started)

```
╔════════════════════════════════════╗
║  ✅ Backend Started Successfully!  ║
╚════════════════════════════════════╝

Service URLs:
  Backend API:  http://localhost:3000
  API Docs:     http://localhost:3000/api/docs
  Health Check: http://localhost:3000/api/v1/health

Demo Login Credentials:
  Traveller:
    Email:    traveller@test.com
    Password: Test123!
```

### Login Page (Working)

```
        ✈️
   BTMTravel COBT
Corporate Booking Tool

┌────────────────────────────┐
│ Welcome Back               │
│                            │
│ Email: [              ]    │
│ Password: [           ]    │
│                            │
│ [      Login      ]        │
│ [ Demo Login as Traveller ]│
│                            │
│ ✅ Backend connected       │
└────────────────────────────┘
```

---

## 🎉 Success!

Once you see 🟢 "Backend connected" on the login page:

1. Click **"Demo Login as Traveller"**
2. You'll be redirected to the Traveller Dashboard
3. Start booking flights! ✈️

---

## 📚 More Documentation

- **[STATUS.md](./STATUS.md)** - Complete project status
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Detailed troubleshooting
- **[QUICK_REF.md](./QUICK_REF.md)** - Quick reference card
- **[backend/README.md](./backend/README.md)** - Backend documentation

---

## 🆘 Still Not Working?

1. **Check Docker is running:**
   ```bash
   docker info
   ```

2. **Check ports are free:**
   ```bash
   lsof -i :3000  # Backend API
   lsof -i :5432  # PostgreSQL
   lsof -i :5173  # Frontend
   ```

3. **View detailed logs:**
   ```bash
   cd backend
   docker-compose logs --tail=100
   ```

4. **Try the nuclear option** (see Troubleshooting section above)

---

**Need help?** Check the comprehensive guides or open an issue!

**Backend running?** Great! Now just run `npm run dev` and start coding! 🚀
