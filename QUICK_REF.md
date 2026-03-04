# 🚀 COBT Quick Reference Card

## Start Application

```bash
# Backend
cd backend && docker-compose up -d

# Frontend  
npm run dev

# Open: http://localhost:5173
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Traveller | traveller@test.com | Test123! |
| Arranger | arranger@test.com | Test123! |
| Admin | admin@test.com | Test123! |

## Status Indicators

- 🟢 Backend connected → Ready to login
- 🔴 Backend offline → Start backend
- 🟡 Checking → Please wait

## Quick Commands

```bash
# Check backend health
curl http://localhost:3000/api/v1/health

# View logs
cd backend && docker-compose logs -f api

# Restart backend
cd backend && docker-compose restart

# Stop all
cd backend && docker-compose down
```

## Common Issues

| Problem | Solution |
|---------|----------|
| Network error | `cd backend && docker-compose up -d` |
| Export error | Hard refresh: Ctrl+Shift+R |
| Port in use | Change PORT in .env |
| Login fails | Check demo credentials above |

## Helpful Links

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## Documentation

- STATUS.md - Current status
- GETTING_STARTED.md - Full setup
- TROUBLESHOOTING.md - Fix issues
- BACKEND_SETUP.md - Backend help

## Emergency Reset

```bash
cd backend
docker-compose down -v
docker-compose up -d
./scripts/create-test-accounts.sh
```

---

**Everything working?** Start customizing! 🎨
**Having issues?** Check STATUS.md 📖
