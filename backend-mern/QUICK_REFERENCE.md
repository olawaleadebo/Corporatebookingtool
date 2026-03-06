# 🚀 COBT Backend - Quick Reference

## Start/Stop Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build && npm start

# Health check
npm run health
```

## Essential URLs

| Service | URL |
|---------|-----|
| API Base | `http://localhost:3001/api/v1` |
| Health Check | `http://localhost:3001/health` |
| WebSocket | `http://localhost:3001` |
| ngrok (External) | `https://chromoplasmic-ungaping-danielle.ngrok-free.dev` |

## Environment Variables

```bash
# Core
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...

# Auth
JWT_SECRET=your-secret-here

# WebSocket
NGROK_URL=https://...
ENABLE_WEBSOCKET=true
```

## API Endpoints Cheat Sheet

### Authentication
```bash
POST   /api/v1/auth/register      # Register user
POST   /api/v1/auth/login         # Login
POST   /api/v1/auth/refresh-token # Refresh token
POST   /api/v1/auth/logout        # Logout
GET    /api/v1/auth/profile       # Get profile
```

### Search
```bash
GET    /api/v1/search/flights     # Search flights
GET    /api/v1/search/hotels      # Search hotels
GET    /api/v1/search/cars        # Search cars
```

### Bookings
```bash
POST   /api/v1/bookings           # Create booking
GET    /api/v1/bookings           # List bookings
GET    /api/v1/bookings/:id       # Get booking
PATCH  /api/v1/bookings/:id/approve  # Approve
PATCH  /api/v1/bookings/:id/reject   # Reject
```

### Payments
```bash
POST   /api/v1/payments/initialize       # Initialize
GET    /api/v1/payments/verify/:ref      # Verify
POST   /api/v1/payments/refund/:ref      # Refund
```

## Common curl Commands

### Register
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Pass123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "traveller",
    "department": "Engineering"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Pass123!"
  }'
```

### Search Flights
```bash
curl "http://localhost:3001/api/v1/search/flights?origin=LOS&destination=ABV&departureDate=2026-04-15&adults=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## User Roles

| Role | Permissions |
|------|-------------|
| `traveller` | Create bookings, view own bookings |
| `travel_arranger` | Approve/reject bookings, view all |
| `admin` | Full access, refund payments |

## Cache Configuration

| Resource | Cache Duration |
|----------|----------------|
| Flights | 30 minutes |
| Hotels | 30 minutes |
| Cars | 30 minutes |

## WebSocket Events

```javascript
// Client connects
socket.emit('join', userId);

// Server events
socket.on('booking:updated', (data) => {...});
socket.on('payment:updated', (data) => {...});
socket.on('notification', (data) => {...});
```

## Database Collections

```
users
  - email, password, firstName, lastName
  - role, department, costCenter
  - refreshToken, lastLogin

bookings
  - userId, bookingReference, type, status
  - flightDetails, hotelDetails, carDetails
  - pricing, approval workflow

payments
  - bookingId, userId, amount, currency
  - status, paystackReference
```

## Useful Commands

```bash
# Check server health
curl http://localhost:3001/health

# View logs
tail -f logs/combined.log

# Clear Redis cache
# (Connect to Redis and run: FLUSHALL)

# Restart server
pkill -f "ts-node-dev" && npm run dev

# Check MongoDB connection
# (Check Atlas dashboard)
```

## Troubleshooting Quick Fixes

```bash
# Port in use
lsof -i :3001 | grep LISTEN
kill -9 <PID>

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Reset logs
rm -rf logs/*
```

## Mock Data

When `USE_MOCK_DATA=true` or external APIs fail:

- **Flights**: ₦110,000 - ₦925,000
- **Hotels**: ₦55,000 - ₦360,000
- **Cars**: ₦15,000 - ₦65,000/day

All with realistic Nigerian airline names, hotel brands, etc.

## Security

- JWT expires: 7 days
- Refresh token: 30 days
- Rate limit: 100 req/15min
- Password: bcrypt hashed
- CORS: Configured

## File Structure

```
backend-mern/
├── src/
│   ├── config/         # Database, Redis, JWT, WebSocket
│   ├── models/         # Mongoose models
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic, cache
│   ├── routes/         # API routes
│   ├── middleware/     # Auth, errors, logging
│   └── utils/          # Logger, mock data
├── logs/               # Winston logs
├── .env                # Environment config
└── package.json
```

## Environment Setup

```bash
# Fresh install
cd backend-mern
npm install
cp .env.example .env
npm run dev

# Seed database
npm run seed

# Health check
npm run health
```

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "count": 10
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

## Tips & Tricks

1. **Debug Mode**: Set `LOG_LEVEL=debug` in `.env`
2. **Skip Redis**: Comment out `REDIS_URL` to disable caching
3. **Mock Data**: Set `USE_MOCK_DATA=true` for testing
4. **Rate Limits**: Increase for development testing
5. **CORS Issues**: Add your origin to allowed list in `app.ts`

## Support

- Documentation: See `README.md`, `SETUP_GUIDE.md`
- Logs: Check `logs/combined.log` and `logs/error.log`
- Health: Run `npm run health`
- Team: Contact BTMTravel development team

---

**Keep this file handy for quick reference! 📌**
