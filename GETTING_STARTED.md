# Getting Started with COBT

This guide will get you up and running with the Corporate Booking Tool in **15 minutes**.

## Step 1: Prerequisites (5 minutes)

### Install Required Software

1. **Node.js 18+**
   ```bash
   # Check if installed
   node --version
   
   # If not installed, download from https://nodejs.org/
   ```

2. **Docker & Docker Compose**
   ```bash
   # Check if installed
   docker --version
   docker-compose --version
   
   # If not installed:
   # Linux: https://docs.docker.com/engine/install/
   # Mac: https://docs.docker.com/desktop/mac/install/
   # Windows: https://docs.docker.com/desktop/windows/install/
   ```

3. **Git**
   ```bash
   # Check if installed
   git --version
   
   # If not installed: https://git-scm.com/downloads
   ```

---

## Step 2: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone <your-repository-url>
cd cobt

# Install frontend dependencies
npm install
```

---

## Step 3: Start Backend (5 minutes)

### Option A: Using Docker (Recommended)

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Start all services (PostgreSQL, Kafka, Redis, API, NGINX)
docker-compose up -d

# Wait ~30 seconds for all services to be ready
# Check status
docker-compose ps

# View logs (optional)
docker-compose logs -f api
```

### Option B: Manual Setup (For Development)

```bash
cd backend

# Install dependencies
npm install

# Setup PostgreSQL locally
# Create database: cobt_db
# Update .env with your database credentials

# Start development server
npm run start:dev
```

---

## Step 4: Create Test Accounts (1 minute)

```bash
# Make script executable
chmod +x scripts/create-test-accounts.sh

# Run script
./scripts/create-test-accounts.sh
```

This creates three test accounts:
- **Traveller**: traveller@test.com / Test123!
- **Travel Arranger**: arranger@test.com / Test123!
- **Admin**: admin@test.com / Test123!

---

## Step 5: Start Frontend (2 minutes)

```bash
# Return to project root
cd ..

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will open at: **http://localhost:5173**

---

## Step 6: Verify Everything Works ✅

### Backend Health Check

```bash
# Check API health
curl http://localhost:3000/api/v1/health

# Expected response:
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    ...
  }
}
```

### Frontend Access

1. Open http://localhost:5173
2. You should see the login page with airplane background
3. Click "Demo Login as Traveller"
4. You should be redirected to the Traveller Dashboard

### API Documentation

Visit http://localhost:3000/api/docs to see Swagger documentation

---

## Step 7: Test the Application

### As Traveller (traveller@test.com)

1. **Search for Flights**
   - Click "New Booking"
   - Enter: Lagos (LOS) → London (LHR)
   - Date: Any future date
   - Click "Search Flights"

2. **Create Booking**
   - Select a flight
   - Choose hotel
   - Select car (optional)
   - Add justification
   - Submit for approval

3. **View Bookings**
   - Go to "My Bookings"
   - See your booking with status "Pending Approval"

### As Travel Arranger (arranger@test.com)

1. **Logout** (if logged in as traveller)
2. Click "Demo Login as Travel Arranger"
3. Go to "Pending Approvals"
4. Review and approve/reject bookings

### As Admin (admin@test.com)

1. **Logout** (if logged in)
2. Click "Demo Login as Admin"
3. Explore:
   - User Management
   - Policy Management
   - Budget Management
   - Reports
   - Company Settings (upload logo, customize branding)

---

## Common Issues & Solutions

### Issue: Backend won't start

**Solution:**
```bash
# Check if ports are available
lsof -i :3000
lsof -i :5432

# Stop any conflicting services
docker-compose down

# Restart
docker-compose up -d
```

### Issue: Database connection error

**Solution:**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue: Frontend shows connection error

**Solution:**
```bash
# Check backend is running
curl http://localhost:3000/api/v1/health

# Check .env file has correct API_URL
cat .env

# Should show:
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### Issue: Login fails

**Solution:**
```bash
# Make sure test accounts were created
./backend/scripts/create-test-accounts.sh

# Or manually create via API
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "traveller"
  }'
```

---

## Next Steps

### 1. Configure External Services

#### Amadeus API (for real flight data)

1. Sign up at https://developers.amadeus.com
2. Create an application
3. Get your API credentials
4. Update `backend/.env`:
   ```bash
   AMADEUS_CLIENT_ID=your_client_id
   AMADEUS_CLIENT_SECRET=your_client_secret
   AMADEUS_HOSTNAME=test.api.amadeus.com
   ```
5. Restart backend: `docker-compose restart api`

#### Paystack (for payments)

1. Sign up at https://paystack.com
2. Get your API keys from dashboard
3. Update `backend/.env`:
   ```bash
   PAYSTACK_SECRET_KEY=sk_test_xxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxx
   ```
4. Restart backend: `docker-compose restart api`

### 2. Explore the Codebase

- **Frontend Services**: `/src/services/` - API integration layer
- **Backend Modules**: `/backend/src/modules/` - Feature modules
- **API Docs**: http://localhost:3000/api/docs

### 3. Read Documentation

- [Frontend Integration Guide](./FRONTEND_INTEGRATION.md)
- [Backend README](./backend/README.md)
- [Deployment Guide](./backend/DEPLOYMENT.md)
- [API Integration](./backend/INTEGRATION.md)

### 4. Customize for Your Needs

- Update company branding via Admin Dashboard
- Configure travel policies
- Set budget limits
- Add more users

---

## Quick Commands Reference

### Backend

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api

# Restart API
docker-compose restart api

# Shell access
docker-compose exec api sh

# Run migrations
docker-compose exec api npm run migration:run
```

### Frontend

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Backup database
docker exec cobt-postgres pg_dump -U cobt_user cobt_db > backup.sql

# Restore database
cat backup.sql | docker exec -i cobt-postgres psql -U cobt_user cobt_db

# Connect to database
docker exec -it cobt-postgres psql -U cobt_user -d cobt_db
```

---

## Development Workflow

1. **Make changes** to code
2. **Frontend**: Hot reload automatically updates
3. **Backend**: Save file, server restarts automatically
4. **Test**: Use browser or Postman
5. **Commit**: `git add . && git commit -m "Your message"`

---

## Production Deployment

When ready to deploy:

1. **Frontend**: Follow [Vercel/Netlify deployment](./README.md#deployment)
2. **Backend**: Follow [VPS Deployment Guide](./backend/DEPLOYMENT.md)
3. **Update Environment**: Use production URLs and credentials
4. **Enable HTTPS**: Configure SSL certificates
5. **Configure Webhooks**: Set Paystack webhook URL
6. **Test**: Thoroughly test all features

---

## Getting Help

### Documentation
- Main README: [README.md](./README.md)
- API Docs: http://localhost:3000/api/docs
- Backend Docs: [backend/README.md](./backend/README.md)

### Logs
```bash
# Backend logs
docker-compose logs -f

# Application logs
tail -f backend/logs/combined.log

# Error logs
tail -f backend/logs/error.log
```

### Health Checks
```bash
# API health
curl http://localhost:3000/api/v1/health

# Database
docker-compose exec postgres pg_isready

# Kafka
docker-compose exec kafka kafka-topics --list --bootstrap-server localhost:9092
```

---

## Success Criteria ✅

You're ready to go when:

- [ ] Backend running at http://localhost:3000
- [ ] Frontend running at http://localhost:5173
- [ ] Can login with test accounts
- [ ] Can search for flights
- [ ] Can create bookings
- [ ] Can approve bookings as arranger
- [ ] Can access admin dashboard
- [ ] API docs accessible at /api/docs
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

**Congratulations! 🎉 Your COBT system is now running!**

Start exploring the features and customize it for your company's needs.

For questions or issues, refer to the documentation or check the logs.
