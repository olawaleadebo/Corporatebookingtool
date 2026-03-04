# 🔧 Troubleshooting Network Errors

## Error Fixed! ✅

The application now has:

1. **Backend Connection Checking** - Automatically checks if backend is reachable
2. **Status Indicator** - Shows green/red status on login page
3. **Helpful Error Messages** - Clear instructions when backend is offline
4. **Retry Button** - Easy way to check connection again

---

## What You Need to Do Now

### Step 1: Start the Backend

Open a **new terminal** window and run:

```bash
cd backend
docker-compose up -d
```

Wait about 30 seconds for all services to start.

### Step 2: Create Test Accounts

```bash
chmod +x scripts/create-test-accounts.sh
./scripts/create-test-accounts.sh
```

### Step 3: Verify Backend is Running

```bash
curl http://localhost:3000/api/v1/health
```

You should see:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

### Step 4: Refresh Frontend

1. Go back to http://localhost:5173
2. The login page will automatically detect backend
3. You should see: ✅ "Backend connected" (green checkmark)
4. Click "Demo Login as Traveller"

---

## What Changed?

### 1. Enhanced Error Handling (`/src/lib/api.ts`)
- Better network error detection
- Helpful error messages showing API URL
- Prevents toast spam on health checks

### 2. Connection Status Check (`/src/app/pages/Login.tsx`)
- Checks backend on page load
- Shows status indicator (checking/online/offline)
- Prevents login attempts when backend is offline
- Retry button to check again

### 3. Visual Indicators
- 🟡 Yellow pulse: Checking connection
- 🟢 Green check: Backend connected
- 🔴 Red alert: Backend offline with instructions

### 4. Helpful Alert Component
- Shows when backend is offline
- Quick start commands
- Retry button
- Link to setup guide

---

## Current Architecture

```
┌─────────────────┐
│   Frontend      │
│  localhost:5173 │
│                 │
│  ✓ Status Check │
│  ✓ Error Display│
│  ✓ Auto-Retry   │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
         ▼
┌─────────────────┐
│   Backend API   │
│  localhost:3000 │
│                 │
│  ✓ NestJS       │
│  ✓ PostgreSQL   │
│  ✓ Kafka        │
│  ✓ Redis        │
└─────────────────┘
```

---

## Quick Diagnostics

### Check if Backend is Running

```bash
# Method 1: Docker
cd backend
docker-compose ps

# Method 2: Health endpoint
curl http://localhost:3000/api/v1/health

# Method 3: Check port
lsof -i :3000
```

### Check Frontend Environment

```bash
# View environment variables
cat .env

# Should show:
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### View Backend Logs

```bash
cd backend
docker-compose logs -f api
```

---

## Common Scenarios

### Scenario 1: Fresh Setup (First Time)

```bash
# Terminal 1: Backend
cd backend
cp .env.example .env
docker-compose up -d
./scripts/create-test-accounts.sh

# Terminal 2: Frontend
cd ..
npm install
npm run dev
```

### Scenario 2: Backend Already Running

```bash
# Just start frontend
npm run dev

# Frontend will detect running backend
# Login page shows: ✅ "Backend connected"
```

### Scenario 3: Backend Was Running, Now Stopped

```bash
# Restart backend
cd backend
docker-compose up -d

# Refresh browser or click "Retry" button
```

### Scenario 4: Backend on Different Port

```bash
# Update .env in project root
VITE_API_URL=http://localhost:3001/api/v1
VITE_WS_URL=http://localhost:3001

# Restart frontend dev server
```

---

## Testing the Fix

### 1. With Backend Running

```bash
# Start backend
cd backend
docker-compose up -d
```

Open http://localhost:5173:
- Should show: ✅ "Backend connected"
- Demo login should work
- No network errors

### 2. With Backend Stopped

```bash
# Stop backend
cd backend
docker-compose down
```

Open http://localhost:5173:
- Should show: 🔴 "Backend offline - Start backend server"
- Red alert box with instructions
- "Retry" button visible
- Login buttons disabled

### 3. After Starting Backend

```bash
# Start backend
cd backend
docker-compose up -d
```

On login page:
- Click "Retry" button
- Should change to: ✅ "Backend connected"
- Login buttons enabled
- Demo login works!

---

## Error Messages Explained

### "Network Error"
- **Cause**: Backend not running or unreachable
- **Fix**: Start backend with `docker-compose up -d`

### "Cannot connect to server"
- **Cause**: Wrong API URL or firewall blocking
- **Fix**: Check `.env` has correct `VITE_API_URL`

### "Session expired"
- **Cause**: JWT token expired or invalid
- **Fix**: Normal behavior, just login again

### "Backend offline - Start backend server"
- **Cause**: Health check failed
- **Fix**: Start backend and click "Retry"

---

## Port Configuration

### Default Ports

| Service    | Port  | URL                          |
|------------|-------|------------------------------|
| Frontend   | 5173  | http://localhost:5173        |
| Backend    | 3000  | http://localhost:3000        |
| PostgreSQL | 5432  | localhost:5432               |
| Kafka      | 9092  | localhost:9092               |
| Redis      | 6379  | localhost:6379               |

### Change Ports (if needed)

**Frontend** (.env):
```bash
VITE_PORT=5174
```

**Backend** (backend/.env):
```bash
PORT=3001
```

Then update frontend `.env`:
```bash
VITE_API_URL=http://localhost:3001/api/v1
```

---

## Pro Tips

### 1. Keep Backend Logs Open

```bash
cd backend
docker-compose logs -f api
```

This helps debug issues in real-time.

### 2. Use Browser DevTools

- **Network Tab**: See API requests/responses
- **Console Tab**: Check for errors
- **Application Tab**: View localStorage tokens

### 3. Environment Variables

Frontend env vars must start with `VITE_` to be available in the app.

### 4. CORS Issues

If you see CORS errors, check backend `.env`:
```bash
CORS_ORIGIN=http://localhost:5173
```

---

## Success Checklist

- [ ] Backend running: `docker-compose ps` shows all services
- [ ] Health check works: `curl http://localhost:3000/api/v1/health`
- [ ] Test accounts created: `./scripts/create-test-accounts.sh`
- [ ] Frontend running: http://localhost:5173 accessible
- [ ] Status shows: ✅ "Backend connected"
- [ ] Demo login works without errors
- [ ] Can see dashboard after login

---

## Still Having Issues?

### Complete Reset

```bash
# Stop everything
cd backend
docker-compose down -v
docker system prune -a

# Start fresh
docker-compose up -d
sleep 30
./scripts/create-test-accounts.sh

# Restart frontend
cd ..
npm run dev
```

### Check Docker

```bash
# Ensure Docker is running
docker info

# Check disk space
docker system df

# Clean up if needed
docker system prune
```

### Verify Network

```bash
# Check if ports are accessible
nc -zv localhost 3000
nc -zv localhost 5173

# Check firewall (Linux)
sudo ufw status

# Check firewall (Mac)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

---

## Documentation Links

- **Quick Start**: [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Backend Setup**: [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Full Integration**: [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
- **API Testing**: [backend/API_TESTING.md](./backend/API_TESTING.md)

---

## Summary of Changes

✅ **Added connection checking to login page**
✅ **Visual status indicators (green/red/yellow)**
✅ **Helpful error messages with API URL**
✅ **Retry button for easy reconnection**
✅ **Alert component with quick start commands**
✅ **Better error handling in API client**
✅ **Prevention of login when backend offline**

**The network error is now handled gracefully with clear user feedback!** 🎉
