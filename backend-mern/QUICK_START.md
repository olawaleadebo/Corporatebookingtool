# COBT Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend-mern
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

**Minimal `.env` configuration (for local development):**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cobt
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cobt
```

### Step 4: Seed Demo Users (Optional)
```bash
npx ts-node scripts/seed-users.ts
```

This creates 3 demo accounts:
- **Traveller**: traveller@btmtravel.com / password123
- **Travel Arranger**: arranger@btmtravel.com / password123
- **Admin**: admin@btmtravel.com / password123

### Step 5: Start the Server
```bash
npm run dev
```

✅ Server running at: http://localhost:3001

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Register a User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "traveller"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📊 Verify Everything is Working

1. **MongoDB Connected**: Check server logs for "MongoDB connected successfully"
2. **Server Running**: Visit http://localhost:3001
3. **Health Check**: Visit http://localhost:3001/health

## 🔧 Common Issues

### MongoDB Connection Failed
- **Local**: Make sure MongoDB is running
- **Atlas**: Check your connection string and network access settings

### Port Already in Use
Change the port in `.env`:
```env
PORT=3002
```

### Cannot Find Module
Make sure you ran `npm install`

## 📝 Next Steps

1. **Connect Frontend**: Update frontend API URL to `http://localhost:3001`
2. **Configure Amadeus**: Add Amadeus credentials to `.env` (optional - mock data works without it)
3. **Configure Paystack**: Add Paystack keys to `.env` (optional - mock payments work without it)

## 🎯 API Endpoints

- Auth: http://localhost:3001/api/v1/auth
- Search: http://localhost:3001/api/v1/search
- Bookings: http://localhost:3001/api/v1/bookings
- Payments: http://localhost:3001/api/v1/payments

## 💡 Development Tips

- Logs are in `logs/` folder
- Server auto-restarts on file changes
- Mock data automatically used when APIs aren't configured

## 🆘 Need Help?

Check the main README.md for detailed documentation.
