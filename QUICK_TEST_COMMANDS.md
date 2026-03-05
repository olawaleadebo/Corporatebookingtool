# ⚡ Quick Test Commands Reference Card

Keep this handy for fast backend testing!

---

## 🚀 One-Command Tests

### Test Everything (Recommended)
```bash
./test-backend.sh
```

### Quick Health Check
```bash
curl http://localhost:3000/api/v1/health
```

### Is Server Alive?
```bash
curl http://localhost:3000/api/v1/health/live
```

### Is Server Ready?
```bash
curl http://localhost:3000/api/v1/health/ready
```

---

## 🐳 Docker Commands

### Start Backend
```bash
cd backend && docker-compose up -d
```

### Stop Backend
```bash
cd backend && docker-compose down
```

### Restart Backend
```bash
cd backend && docker-compose restart
```

### View Logs (Follow)
```bash
cd backend && docker-compose logs -f api
```

### View All Logs
```bash
cd backend && docker-compose logs
```

### Check Container Status
```bash
cd backend && docker-compose ps
```

---

## 🔍 Diagnostic Commands

### Check Port 3000
```bash
lsof -i :3000
```

### Kill Process on Port 3000
```bash
# First find PID
lsof -i :3000
# Then kill (replace <PID> with actual number)
kill -9 <PID>
```

### Test Database Connection
```bash
curl http://localhost:3000/api/v1/health | grep database
```

### Pretty Print Health Check (requires jq)
```bash
curl -s http://localhost:3000/api/v1/health | jq '.'
```

---

## 🌐 Browser URLs

### Open Status Monitor
```bash
open http://localhost:5173/backend-test
# or on Linux:
xdg-open http://localhost:5173/backend-test
```

### Open API Docs
```bash
open http://localhost:3000/api/docs
```

### Open Frontend
```bash
open http://localhost:5173
```

---

## 🧪 Frontend Test Commands

### Start Frontend
```bash
npm run dev
```

### Build Frontend
```bash
npm run build
```

### Run Frontend Tests
```bash
npm test
```

---

## 📊 Complete Startup Sequence

### Full System Start (Copy-paste all)
```bash
# Start backend
cd backend && docker-compose up -d && cd ..

# Wait for services
sleep 30

# Test backend
./test-backend.sh

# Start frontend
npm run dev
```

---

## 🔧 Troubleshooting Commands

### Reset Everything
```bash
cd backend
docker-compose down
docker-compose up -d
cd ..
sleep 30
./test-backend.sh
```

### View Database Logs
```bash
cd backend && docker-compose logs postgres
```

### View Redis Logs
```bash
cd backend && docker-compose logs redis
```

### View Kafka Logs
```bash
cd backend && docker-compose logs kafka
```

### Restart Single Service
```bash
cd backend && docker-compose restart api
```

---

## 📝 Create Test Accounts

### Run Account Creation Script
```bash
cd backend && ./scripts/create-test-accounts.sh && cd ..
```

---

## 🎯 Quick Checks

### Backend Running?
```bash
curl -I http://localhost:3000/api/v1/health/live
# Should return: HTTP/1.1 200 OK
```

### Database Connected?
```bash
curl -s http://localhost:3000/api/v1/health | grep -o '"database":{"status":"[^"]*"}'
# Should return: "database":{"status":"up"}
```

### All Services Up?
```bash
cd backend && docker-compose ps | grep -c "Up"
# Should return: 5 (or number of services)
```

---

## 💡 Pro Tips

### Chain Commands
```bash
# Start backend and test in one line
cd backend && docker-compose up -d && cd .. && sleep 30 && ./test-backend.sh
```

### Background Logs
```bash
# View logs in background
cd backend && docker-compose logs -f api &
```

### Watch Health Endpoint
```bash
# Check health every 5 seconds
watch -n 5 'curl -s http://localhost:3000/api/v1/health | jq .status'
```

---

## 📋 Common Workflows

### Morning Startup
```bash
cd backend && docker-compose start && cd ..
npm run dev
```

### End of Day Shutdown
```bash
cd backend && docker-compose stop
```

### Quick Test Before Commit
```bash
./test-backend.sh && echo "✅ Ready to commit"
```

### Full Health Report
```bash
echo "Backend:" && curl -s http://localhost:3000/api/v1/health | jq '.'
echo "\nDocker:" && cd backend && docker-compose ps && cd ..
```

---

## 🎨 Visual Indicators

### Login Page
- 🟢 = Backend online → Ready to login
- 🟡 = Checking → Wait
- 🔴 = Offline → Start backend

### Status Monitor
- Green badges = All good
- Yellow badges = Testing
- Red badges = Issues

### Test Script
- ✓ Green = Passed
- ✗ Red = Failed
- ○ Yellow = Warning

---

## 📞 Quick Help

### Can't connect?
```bash
cd backend && docker-compose up -d && sleep 30
```

### Database issues?
```bash
cd backend && docker-compose restart postgres
```

### Logs show errors?
```bash
cd backend && docker-compose logs api | tail -100
```

---

## 🔗 Quick Links

- **Status Monitor**: http://localhost:5173/backend-test
- **API Health**: http://localhost:3000/api/v1/health
- **API Docs**: http://localhost:3000/api/docs
- **Frontend**: http://localhost:5173

---

## 💾 Save These Aliases (Optional)

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# BTMTravel COBT aliases
alias cobt-test='./test-backend.sh'
alias cobt-start='cd backend && docker-compose up -d && cd ..'
alias cobt-stop='cd backend && docker-compose down && cd ..'
alias cobt-logs='cd backend && docker-compose logs -f api'
alias cobt-health='curl -s http://localhost:3000/api/v1/health | jq .'
alias cobt-dev='npm run dev'
```

Then use:
```bash
cobt-test      # Run tests
cobt-start     # Start backend
cobt-logs      # View logs
cobt-health    # Check health
cobt-dev       # Start frontend
```

---

**Keep this card handy for quick reference!** 📌

Print or bookmark: `/QUICK_TEST_COMMANDS.md`
