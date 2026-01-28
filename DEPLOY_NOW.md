# 🚀 Deployment Quick Start

Your event ticketing application is **ready for production deployment**!

## ✅ What's Been Prepared

- **Deployment Configurations**: `render.yaml`, `vercel.json`
- **Environment Templates**: `.env.example`, `.env.production.example`
- **Production Code Updates**: CORS, health checks, graceful shutdown
- **Git Repository**: Initialized and committed
- **Documentation**: Complete deployment guides

## 📋 Next Steps (30-45 minutes)

### 1. Push to GitHub (5 min)
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/event-ticketing-app.git
git push -u origin main
```

### 2. MongoDB Atlas (10 min)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Add database user
4. Allow network access (0.0.0.0/0)
5. Get connection string

### 3. Deploy Backend - Render (15 min)
1. Sign up at [render.com](https://render.com) with GitHub
2. New Web Service → Connect repository
3. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables (see `.env.production.example`)
5. Deploy and copy URL

### 4. Deploy Frontend - Vercel (10 min)
1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. Import repository
3. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
4. Add env var: `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`
5. Deploy and copy URL

### 5. Update CORS (2 min)
1. Go to Render → Your service → Environment
2. Add `FRONTEND_URL=https://YOUR-APP.vercel.app`
3. Save (auto-redeploys)

## 📚 Full Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed step-by-step guide
- **[DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md)** - Quick reference
- **[README.md](README.md)** - Project overview

## 🔍 Pre-flight Check

Run before deploying:
```bash
./check-deployment.sh
```

## 💡 Need Help?

See the troubleshooting section in [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting)

---

**Ready to deploy? Start with step 1 above! 🎉**
