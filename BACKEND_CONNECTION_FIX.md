# Fix: Backend Not Reachable / Network Error

## Problem
You're seeing these errors:
- "Backend not reachable"
- "Flight search error: AxiosError: Network Error"

## Root Cause
The frontend cannot connect to the backend API at `http://localhost:3000/api/v1`.

## Solution

### Step 1: Verify Backend is Running

```bash
# Check if backend is responding
curl http://localhost:3000/api/v1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "info": {
    "database": {"status": "up"},
    "kafka": {"status": "up"}
  }
}
```

If you get **"Connection refused"** or **timeout**, the backend is NOT running.

### Step 2: Start the Backend

#### Option A: Using Docker (Recommended)

```bash
cd backend
docker-compose up -d
```

Wait 30 seconds for services to initialize, then verify:

```bash
curl http://localhost:3000/api/v1/health
```

#### Option B: Manual Start (Development)

```bash
cd backend

# Install dependencies
npm install

# Start PostgreSQL and Kafka with Docker
docker-compose up -d postgres kafka

# Start the NestJS app
npm run start:dev
```

### Step 3: Verify Frontend Environment

Ensure you have a `.env` file in the project root:

```bash
# Check if .env exists
cat .env
```

**Should contain:**
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

If missing, create it:

```bash
cp .env.example .env
```

### Step 4: Restart Frontend

```bash
# Stop the dev server (Ctrl+C if running)
# Then restart:
npm run dev
```

### Step 5: Test the Connection

1. Open browser: http://localhost:5173
2. Open browser console (F12)
3. Try searching for a flight
4. Check console for errors

## Still Not Working?

### Check Docker Services

```bash
cd backend
docker-compose ps
```

All services should show "Up":
- `backend-app-1`
- `backend-postgres-1`
- `backend-kafka-1`
- `backend-zookeeper-1`

### View Backend Logs

```bash
cd backend
docker-compose logs -f app
```

Look for:
- ✅ "Nest application successfully started"
- ✅ "Database connected"
- ❌ Any error messages

### Check Port Availability

```bash
# Check if something else is using port 3000
lsof -i :3000

# If yes, kill it or use a different port
```

### CORS Issues?

The backend should already be configured for `http://localhost:5173`. 

If you changed the frontend port, update `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:YOUR_PORT'],
  credentials: true,
});
```

### Common Issues

| Error | Solution |
|-------|----------|
| Port 3000 already in use | Kill the process: `lsof -i :3000` then `kill -9 <PID>` |
| Docker not running | Start Docker Desktop |
| PostgreSQL connection failed | Check `docker-compose logs postgres` |
| Environment variables not loaded | Restart Vite dev server |

## Quick Verification Checklist

- [ ] Backend running: `curl http://localhost:3000/api/v1/health`
- [ ] Frontend .env file exists with correct URL
- [ ] Docker services all "Up": `docker-compose ps`
- [ ] No port conflicts: `lsof -i :3000` and `lsof -i :5173`
- [ ] Browser console shows no CORS errors
- [ ] Backend logs show "Nest application successfully started"

## Test Backend Directly

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Test flight search (requires Amadeus API keys)
curl -X POST http://localhost:3000/api/v1/search/flights \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "LOS",
    "destination": "ABV",
    "departureDate": "2026-04-01",
    "adults": 1
  }'
```

## Automated Fix Script

Run this to auto-fix most issues:

```bash
# Make executable
chmod +x check-backend.sh

# Run check
./check-backend.sh
```

## Need More Help?

1. Check full logs: `docker-compose logs -f`
2. Restart everything:
   ```bash
   cd backend
   docker-compose down
   docker-compose up -d
   ```
3. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. Check [BACKEND_SETUP.md](./BACKEND_SETUP.md)

## Success Indicators

When everything is working:

✅ Backend health check returns JSON  
✅ Frontend loads without errors  
✅ Search page displays  
✅ No "Backend not reachable" alerts  
✅ Browser console is clear  
