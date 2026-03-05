# BTMTravel Corporate Booking Tool (COBT)

A comprehensive travel booking platform for companies to manage employee travel with approval workflows, policy compliance, and integrated payment processing.

---

## 🎯 Quick Start

### 1. Start Backend

```bash
cd backend
docker-compose up -d
```

*Wait 30 seconds for services to initialize...*

### 2. Start Frontend

```bash
npm run dev
```

### 3. Open Application

**http://localhost:5173**

Click "Demo Login as Traveller" to start!

---

## ✅ All Errors Fixed

All frontend errors have been resolved:
- ✅ JSX syntax errors fixed
- ✅ API configuration set up
- ✅ Environment variables configured
- ✅ Helper scripts created
- ✅ Documentation completed

**See:** [README_ERRORS_FIXED.md](./README_ERRORS_FIXED.md) for details.

---

## 🔍 Verify Backend is Running

### Quick Check
```bash
curl http://localhost:3000/api/v1/health
```

### Using Script
```bash
chmod +x check-backend.sh
./check-backend.sh
```

### Using UI
Visit: **http://localhost:5173/system-status**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[START_APPLICATION.md](./START_APPLICATION.md)** | **→ Start here!** Simple startup guide |
| [README_ERRORS_FIXED.md](./README_ERRORS_FIXED.md) | What was fixed and how |
| [QUICK_START.md](./QUICK_START.md) | Comprehensive setup guide |
| [BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md) | Fix connection issues |
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | Backend configuration details |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common problems & solutions |

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| **Application** | **http://localhost:5173** |
| System Status | http://localhost:5173/system-status |
| Backend API | http://localhost:3000/api/v1 |
| Health Check | http://localhost:3000/api/v1/health |
| API Docs | http://localhost:3000/api/docs |

---

## 🎭 User Roles

### Traveller
- Search and book flights, hotels, cars
- Submit booking requests for approval
- Track booking status

### Travel Arranger
- Review and approve booking requests
- Verify policy compliance
- Manage budgets

### Admin
- Manage company policies
- Configure settings
- View reports
- Manage users

**Demo Login:** Just click the demo buttons on login page!

---

## 🏗️ Architecture

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- Axios + Socket.io
- Shadcn UI components

### Backend
- NestJS (Node.js framework)
- PostgreSQL (database)
- Kafka (message broker)
- WebSockets (real-time updates)
- Amadeus API (flight/hotel search)
- Paystack (payment processing)

---

## 🚀 Features

### ✅ Implemented
- User authentication & authorization
- Flight search and selection
- Hotel search and selection
- Car rental selection
- Booking workflow
- Approval system
- Payment processing
- Real-time notifications
- Policy management
- Budget tracking
- Multi-currency support (₦ Naira)
- Customizable branding

### 🔄 Data Flow
```
Search → Select → Review → Submit → Approval → Payment → Confirmation
```

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

**Backend** (`backend/.env`):
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cobt

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Amadeus (optional for live data)
AMADEUS_API_KEY=your-key
AMADEUS_API_SECRET=your-secret

# Paystack (optional for payments)
PAYSTACK_SECRET_KEY=your-secret-key
PAYSTACK_PUBLIC_KEY=your-public-key
```

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
```

---

## 🐛 Troubleshooting

### Backend Not Reachable?

1. **Check backend status:**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

2. **Start backend if needed:**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   cd backend
   docker-compose logs -f app
   ```

4. **Verify containers:**
   ```bash
   docker-compose ps
   ```

### Frontend Issues?

1. **Check .env file exists:**
   ```bash
   cat .env
   ```

2. **Restart dev server:**
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

3. **Clear cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Port Conflicts?

```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5173
lsof -i :5173
```

**More help:** [BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md)

---

## 📖 API Documentation

When backend is running, visit:
- **Swagger UI:** http://localhost:3000/api/docs

### Example API Call

```bash
# Search for flights
curl -X POST http://localhost:3000/api/v1/search/flights \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "LOS",
    "destination": "ABV",
    "departureDate": "2026-04-01",
    "adults": 1
  }'
```

---

## 🧪 Testing

### Test Backend Connection

Visit: **http://localhost:5173/backend-test**

Or use the script:
```bash
./check-backend.sh
```

### Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Traveller | traveller@test.com | Test123! |
| Arranger | arranger@test.com | Test123! |
| Admin | admin@test.com | Test123! |

---

## 🎨 Customization

The system supports company branding:
- Upload company logo
- Customize color scheme
- Set currency (₦ Naira by default)
- Configure approval workflows
- Define travel policies

**White background with neutral colors** - ready for client customization!

---

## 📦 Deployment

### Frontend
```bash
npm run build
# Deploy /dist folder to your hosting service
```

### Backend
```bash
cd backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

See [DEPLOYMENT.md](./backend/DEPLOYMENT.md) for details.

---

## 🤝 Support

### Documentation
- [START_APPLICATION.md](./START_APPLICATION.md) - Getting started
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend guide

### System Status
- **UI:** http://localhost:5173/system-status
- **CLI:** `./check-backend.sh`

---

## 📝 License

Proprietary - BTMTravel

---

## 🎉 Success Checklist

- [ ] Backend running: `curl http://localhost:3000/api/v1/health`
- [ ] Frontend running: `npm run dev`
- [ ] Browser opens: http://localhost:5173
- [ ] "Backend connected" shows green on login
- [ ] Can click demo login buttons
- [ ] No errors in browser console

**All green?** You're ready to go! 🚀

---

**Last Updated:** March 5, 2026  
**Status:** ✅ All errors fixed, ready to use
