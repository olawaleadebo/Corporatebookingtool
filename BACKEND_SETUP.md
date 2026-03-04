# 🚨 Backend Not Running - Quick Fix

## The Error You're Seeing

```
Login failed: AxiosError: Network Error
```

This means the **backend server is not running**. The frontend cannot connect to the API.

---

## ✅ Quick Solution (5 minutes)

### Option 1: Using Docker (Recommended)

```bash
# 1. Open a new terminal and navigate to backend folder
cd backend

# 2. Copy environment file (if not done already)
cp .env.example .env

# 3. Start all services with Docker
docker-compose up -d

# 4. Wait about 30 seconds for services to start
# Check if running:
docker-compose ps

# 5. Create test accounts
chmod +x scripts/create-test-accounts.sh
./scripts/create-test-accounts.sh

# 6. Verify backend is running
curl http://localhost:3000/api/v1/health
```

**Expected output:**
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

### Option 2: Manual Start (Without Docker)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Make sure PostgreSQL is running locally
# Create database: cobt_db

# 4. Copy and edit .env
cp .env.example .env
nano .env

# Update these in .env:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_pg_user
DB_PASSWORD=your_pg_password
DB_DATABASE=cobt_db

# 5. Start development server
npm run start:dev
```

---

## ✅ Verify It's Working

1. **Check Backend Health**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

2. **Check Frontend**
   - Go to http://localhost:5173
   - You should see a **green checkmark** with "Backend connected"

3. **Try Demo Login**
   - Click "Demo Login as Traveller"
   - Should work without errors

---

## 🔍 Common Issues

### Issue 1: Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 PID

# Or change port in backend/.env
PORT=3001
```

### Issue 2: Docker Not Installed

**Install Docker:**
- **Mac**: https://docs.docker.com/desktop/mac/install/
- **Windows**: https://docs.docker.com/desktop/windows/install/
- **Linux**: https://docs.docker.com/engine/install/

### Issue 3: Permission Denied (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again, or run:
newgrp docker
```

### Issue 4: PostgreSQL Connection Failed

```bash
# Check if PostgreSQL container is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

---

## 🎯 Step-by-Step First Time Setup

### Terminal 1: Backend

```bash
# Clone repository (if not done)
git clone <repository-url>
cd cobt/backend

# Copy environment file
cp .env.example .env

# Start with Docker
docker-compose up -d

# Wait 30 seconds...

# Create test accounts
chmod +x scripts/create-test-accounts.sh
./scripts/create-test-accounts.sh

# Keep this terminal open to view logs:
docker-compose logs -f api
```

### Terminal 2: Frontend

```bash
# Navigate to project root
cd cobt

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

### Browser

1. Open http://localhost:5173
2. Wait for "Backend connected" green indicator
3. Click "Demo Login as Traveller"
4. You should see the Traveller Dashboard!

---

## 📊 Backend Status Check

Run this script to check all services:

```bash
cd backend

echo "=== Docker Status ==="
docker-compose ps

echo -e "\n=== API Health ==="
curl http://localhost:3000/api/v1/health

echo -e "\n=== API Docs ==="
echo "Open: http://localhost:3000/api/docs"

echo -e "\n=== Frontend URL ==="
echo "Open: http://localhost:5173"
```

---

## 🆘 Still Not Working?

### Check These Files:

1. **Frontend `.env`** (in project root)
   ```bash
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_WS_URL=http://localhost:3000
   ```

2. **Backend `.env`** (in backend folder)
   ```bash
   NODE_ENV=development
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   ```

### View Logs:

```bash
# Backend logs
cd backend
docker-compose logs -f

# Or specific service
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f kafka
```

### Nuclear Option (Start Fresh):

```bash
cd backend

# Stop and remove everything
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
docker-compose up -d

# Wait 30 seconds
sleep 30

# Create test accounts
./scripts/create-test-accounts.sh
```

---

## 📞 Quick Commands

```bash
# Start backend
cd backend && docker-compose up -d

# Stop backend
cd backend && docker-compose down

# Restart backend
cd backend && docker-compose restart api

# View logs
cd backend && docker-compose logs -f api

# Check health
curl http://localhost:3000/api/v1/health

# Create test accounts
cd backend && ./scripts/create-test-accounts.sh
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ `curl http://localhost:3000/api/v1/health` returns JSON
2. ✅ Login page shows "Backend connected" (green)
3. ✅ Demo login works without errors
4. ✅ No "Network Error" in browser console

---

## 🎉 Once Backend is Running

1. Refresh the login page (http://localhost:5173)
2. You should see: ✅ "Backend connected"
3. Click "Demo Login as Traveller"
4. Credentials will auto-fill and login!

---

**Need more help?** Check the comprehensive guides:
- [GETTING_STARTED.md](./GETTING_STARTED.md)
- [backend/QUICKSTART.md](./backend/QUICKSTART.md)
