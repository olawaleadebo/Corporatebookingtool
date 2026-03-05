# Quick Start Guide - BTMTravel COBT

## Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- Git

## 🚀 Starting the Application

### Option 1: Using the Startup Script (Recommended)

```bash
# Make the script executable
chmod +x start.sh check-backend.sh

# Start everything (backend + frontend)
./start.sh
```

### Option 2: Manual Start

#### Step 1: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Start backend with Docker (includes PostgreSQL, Kafka, Redis)
docker-compose up -d

# Wait for services to be ready (about 30 seconds)
# Check backend health
curl http://localhost:3000/api/v1/health
```

#### Step 2: Start the Frontend

```bash
# In a new terminal, from the project root
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## 🔍 Verifying the Setup

### Check Backend Health
```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "kafka": { "status": "up" }
  }
}
```

### Check Backend Logs
```bash
cd backend
docker-compose logs -f app
```

### Check Database
```bash
cd backend
docker-compose exec postgres psql -U postgres -d cobt
```

## 🛠️ Troubleshooting

### Backend Not Starting?

1. **Check if ports are available:**
   ```bash
   # Check if port 3000 is free
   lsof -i :3000
   
   # Check if port 5432 (PostgreSQL) is free
   lsof -i :5432
   ```

2. **Check Docker status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs
   ```

4. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Frontend Shows "Backend Not Reachable"?

1. **Verify backend is running:**
   ```bash
   ./check-backend.sh
   ```

2. **Check environment variables:**
   - Ensure `.env` file exists in project root
   - Verify `VITE_API_URL=http://localhost:3000/api/v1`

3. **Restart frontend:**
   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

### CORS Errors?

The backend is configured to allow `http://localhost:5173` by default. If you're running on a different port, update the CORS settings in `backend/src/main.ts`.

## 📊 Default Test Accounts

After starting the backend, you can create test accounts:

```bash
cd backend
./scripts/create-test-accounts.sh
```

This creates:
- **Admin:** admin@btmtravel.com / admin123
- **Travel Arranger:** arranger@company.com / arranger123
- **Traveller:** traveller@company.com / traveller123

## 🔑 API Keys Required

For full functionality, you need:

1. **Amadeus API** (for flight/hotel search)
   - Sign up at: https://developers.amadeus.com
   - Add keys to `backend/.env`:
     ```
     AMADEUS_API_KEY=your_key
     AMADEUS_API_SECRET=your_secret
     ```

2. **Paystack** (for payments)
   - Sign up at: https://paystack.com
   - Add keys to `backend/.env`:
     ```
     PAYSTACK_SECRET_KEY=your_secret_key
     PAYSTACK_PUBLIC_KEY=your_public_key
     ```

## 📱 Application Flow

1. **Login** → Choose your role (Traveller/Arranger/Admin)
2. **Search** → Search for flights
3. **Select** → Choose a flight
4. **Hotel** → Add hotel (optional)
5. **Car** → Add car rental (optional)
6. **Review** → Review booking summary
7. **Submit** → Request approval
8. **Approval** → Travel Arranger reviews and approves
9. **Payment** → Process payment via Paystack
10. **Confirmation** → Booking confirmed

## 🌐 Key URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api/v1
- **API Docs:** http://localhost:3000/api/docs (Swagger)
- **Health Check:** http://localhost:3000/api/v1/health

## 📚 More Information

- [Backend Setup Guide](./BACKEND_SETUP.md)
- [Testing Guide](./BACKEND_TESTING_GUIDE.md)
- [Integration Architecture](./INTEGRATION_ARCHITECTURE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## 🆘 Need Help?

If you're still having issues:

1. Check all logs: `docker-compose logs -f`
2. Verify all environment variables are set
3. Ensure no other services are using ports 3000, 5432, 9092
4. Try a complete restart: `docker-compose down -v && docker-compose up -d`
