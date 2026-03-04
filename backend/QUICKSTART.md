# Quick Start Guide

Get the COBT backend up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Docker & Docker Compose installed
- [ ] Git installed
- [ ] 4GB+ RAM available
- [ ] 10GB+ disk space available

---

## Local Development (Without Docker)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL

Install PostgreSQL locally or use a hosted instance:

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Create database
psql postgres
CREATE DATABASE cobt_db;
CREATE USER cobt_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE cobt_db TO cobt_user;
\q
```

### 3. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` for local development:
```bash
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=cobt_user
DB_PASSWORD=password
DB_DATABASE=cobt_db

JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret

# Use test Kafka (or comment out Kafka if not needed for testing)
KAFKA_BROKER=localhost:9092

# Amadeus test credentials
AMADEUS_CLIENT_ID=your_test_client_id
AMADEUS_CLIENT_SECRET=your_test_client_secret
AMADEUS_HOSTNAME=test.api.amadeus.com

# Paystack test credentials
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx

CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health

---

## Docker Development (Recommended)

### 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env  # Edit if needed
```

### 3. Start All Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Kafka + Zookeeper (ports 9092, 9093)
- Redis (port 6379)
- API (port 3000)
- Nginx (port 80)

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Just API
docker-compose logs -f api
```

### 5. Run Migrations

```bash
docker-compose exec api npm run migration:run
```

### 6. Verify Installation

```bash
# Check health
curl http://localhost:3000/api/v1/health

# Check API docs
open http://localhost:3000/api/docs
```

---

## Quick Test

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```

Copy the `accessToken` from the response.

### 3. Test Protected Endpoint

```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Default Test Accounts

After initial setup, create these test accounts:

### Traveller
```bash
{
  "email": "traveller@test.com",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "traveller"
}
```

### Travel Arranger
```bash
{
  "email": "arranger@test.com",
  "password": "Test123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "travel_arranger"
}
```

### Admin
```bash
{
  "email": "admin@test.com",
  "password": "Test123!",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

---

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart API
docker-compose restart api

# View logs
docker-compose logs -f api

# Shell access
docker-compose exec api sh

# Run migrations
docker-compose exec api npm run migration:run

# Generate migration
docker-compose exec api npm run migration:generate -- -n MigrationName

# Check status
docker-compose ps

# Clean up
docker-compose down -v  # Warning: deletes all data
```

---

## API Endpoints

### Authentication
```
POST   /api/v1/auth/register     - Register user
POST   /api/v1/auth/login        - Login
POST   /api/v1/auth/refresh      - Refresh token
POST   /api/v1/auth/logout       - Logout
```

### Users
```
GET    /api/v1/users/me          - Get current user
GET    /api/v1/users             - Get all users
GET    /api/v1/users/:id         - Get user
PATCH  /api/v1/users/:id         - Update user
```

### Search
```
GET    /api/v1/search/flights    - Search flights
GET    /api/v1/search/hotels     - Search hotels
```

### Bookings
```
POST   /api/v1/bookings          - Create booking
GET    /api/v1/bookings          - Get bookings
GET    /api/v1/bookings/pending  - Get pending approvals
GET    /api/v1/bookings/:id      - Get booking
PATCH  /api/v1/bookings/:id/approve   - Approve
PATCH  /api/v1/bookings/:id/reject    - Reject
PATCH  /api/v1/bookings/:id/confirm   - Confirm
```

### Payments
```
POST   /api/v1/payments/initialize      - Initialize payment
GET    /api/v1/payments/verify/:ref     - Verify payment
POST   /api/v1/payments/webhook         - Paystack webhook
GET    /api/v1/payments                 - Get payments
GET    /api/v1/payments/:id             - Get payment
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID

# Or change port in .env
PORT=3001
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Kafka Connection Issues

```bash
# Restart Kafka and Zookeeper
docker-compose restart zookeeper kafka

# Check if running
docker-compose ps kafka zookeeper
```

### Cannot Access API

```bash
# Check if API is running
docker-compose ps api

# Check API logs
docker-compose logs api

# Restart API
docker-compose restart api
```

---

## Development Tips

### Hot Reload

The development server watches for file changes:

```bash
# Edit any .ts file
# Server automatically restarts
```

### Debug Mode

```bash
# Start in debug mode
npm run start:debug

# Attach debugger at port 9229
```

### Database GUI

Use a PostgreSQL GUI tool:

- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/

Connection details:
```
Host: localhost
Port: 5432
Database: cobt_db
User: cobt_user
Password: (from .env)
```

### Kafka UI

Access Kafka topics at:
```bash
# Install kafdrop (optional)
docker run -d --rm -p 9000:9000 \
  -e KAFKA_BROKERCONNECT=kafka:9092 \
  --network backend_cobt-network \
  obsidiandynamics/kafdrop
```

Then open: http://localhost:9000

---

## Next Steps

1. ✅ Backend is running
2. 📖 Read [INTEGRATION.md](./INTEGRATION.md) to connect frontend
3. 📚 Explore [API Documentation](http://localhost:3000/api/docs)
4. 🚀 Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for production

---

## Getting Help

- **Logs**: `docker-compose logs -f`
- **Health**: http://localhost:3000/api/v1/health
- **Docs**: http://localhost:3000/api/docs
- **Email**: support@btmtravel.com

---

## Clean Slate

If you need to start fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
docker-compose up -d
docker-compose exec api npm run migration:run
```

---

**You're all set! 🎉**

The backend is now running and ready for integration with your frontend.
