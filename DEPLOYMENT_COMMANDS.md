# Quick Deployment Commands

This file contains quick reference commands for deploying the application.

## Prerequisites Check

```bash
# Check Node.js version (should be v16+)
node --version

# Check npm version
npm --version

# Check git is installed
git --version
```

## Local Environment Setup

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your local MongoDB and email credentials
npm start

# Frontend setup (in a new terminal)
cd frontend
npm install
cp .env.example .env
# Edit .env if needed (default should work for local dev)
npm run dev
```

## Push to GitHub

```bash
# From project root
cd /Users/luffy/Desktop/internproject/event-ticketing-app

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/event-ticketing-app.git

# Push
git branch -M main
git push -u origin main
```

## Generate Secrets

```bash
# Generate JWT secret (run this and copy the output)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Test Backend Health

```bash
# Local
curl http://localhost:5000/health

# Production (replace with your Render URL)
curl https://your-backend.onrender.com/health
```

## Test API Endpoints

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Update After Changes

```bash
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push

# Render and Vercel will auto-deploy
```

## View Logs

```bash
# Render: Go to dashboard → Your service → Logs tab
# Vercel: Go to dashboard → Your project → Deployments → Click deployment → Runtime Logs
```

## MongoDB Atlas Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/event-ticketing?retryWrites=true&w=majority
```

Replace:
- `USERNAME`: Your database username
- `PASSWORD`: Your database password
- `cluster0.xxxxx`: Your cluster URL from Atlas
- `event-ticketing`: Your database name

## Environment Variables Quick Reference

### Backend (Render)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generated-secret>
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<gmail-app-password>
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting Commands

```bash
# Check if port is in use
lsof -i :5000

# Kill process on port
kill -9 $(lsof -t -i:5000)

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check MongoDB connection (from backend directory)
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(err => console.error(err));"
```
