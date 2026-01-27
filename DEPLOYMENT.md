# Deployment Guide - Event Ticketing Application

This guide provides step-by-step instructions to deploy your event ticketing application to production using Render (backend), Vercel (frontend), and MongoDB Atlas (database).

## Prerequisites

Before you begin, ensure you have:
- ✅ A GitHub account
- ✅ Git installed on your local machine
- ✅ Your project code ready to deploy
- ✅ Email credentials (Gmail with App Password) for OTP functionality

## Overview

**Deployment Stack:**
- **Backend**: Render (Node.js hosting)
- **Frontend**: Vercel (React/Vite hosting)
- **Database**: MongoDB Atlas (Cloud MongoDB)

**Estimated Time**: 30-45 minutes

---

## Step 1: Push Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
cd /Users/luffy/Desktop/internproject/event-ticketing-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/event-ticketing-app.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create Account and Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in
3. Click **"Build a Database"**
4. Select **"M0 Free"** tier
5. Choose a cloud provider and region (preferably close to your Render region)
6. Name your cluster (e.g., `event-ticketing-cluster`)
7. Click **"Create"**

### 2.2 Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these!)
5. Set **"Built-in Role"** to **"Read and write to any database"**
6. Click **"Add User"**

### 2.3 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Render to connect
4. Click **"Confirm"**

### 2.4 Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add the database name before the `?`: 
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/event-ticketing?retryWrites=true&w=majority
   ```

**Save this connection string** - you'll need it for Render!

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account

1. Go to [Render](https://render.com)
2. Sign up using your GitHub account
3. Authorize Render to access your repositories

### 3.2 Create Web Service

1. From the Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `event-ticketing-app` repository
4. Configure the service:
   - **Name**: `event-ticketing-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 3.3 Add Environment Variables

In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 2.4 |
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` |
| `PORT` | `5000` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASSWORD` | Your Gmail App Password (see below) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Leave empty for now, update after Vercel deployment |

**To get Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll see a URL like: `https://event-ticketing-backend.onrender.com`
4. **Save this URL** - you'll need it for Vercel!

### 3.5 Verify Backend

Test your backend is working:
```bash
curl https://YOUR-BACKEND-URL.onrender.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-27T...","uptime":123.45}
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up using your GitHub account
3. Authorize Vercel to access your repositories

### 4.2 Import Project

1. From the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Import your `event-ticketing-app` repository
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 4.3 Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |

Replace `YOUR-BACKEND-URL` with your Render backend URL from Step 3.4.

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll see a URL like: `https://event-ticketing-app.vercel.app`

---

## Step 5: Update Backend CORS

Now that you have your Vercel URL, update the backend environment variable:

1. Go back to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to your Vercel URL: `https://YOUR-APP.vercel.app`
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## Step 6: Verification

### 6.1 Test the Application

1. Open your Vercel URL in a browser
2. **Sign up** as an organizer
3. **Create an event** with auto-approval mode
4. **Copy the event link** and open it in an incognito window
5. **Register for the event** with a valid email
6. **Check your email** for the OTP
7. **Enter the OTP** and verify ticket generation

### 6.2 Check Database

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. Verify data is being stored:
   - `users` collection has your organizer account
   - `events` collection has your created event
   - `registrations` collection has the registration
   - `otps` collection has OTP records

### 6.3 Monitor Logs

**Backend Logs (Render):**
1. Go to Render dashboard → Your service
2. Click **"Logs"** tab
3. Check for any errors

**Frontend Logs:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed API calls

---

## Troubleshooting

### Backend Issues

**Problem**: Backend deployment fails
- Check build logs in Render
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**Problem**: MongoDB connection error
- Verify connection string is correct
- Check MongoDB Atlas network access allows 0.0.0.0/0
- Ensure database user has correct permissions

**Problem**: CORS errors
- Verify `FRONTEND_URL` is set correctly in Render
- Check frontend URL matches exactly (no trailing slash)

### Frontend Issues

**Problem**: API calls fail with 404
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend URL is accessible
- Ensure `/api` is included in the URL

**Problem**: Blank page after deployment
- Check browser console for errors
- Verify build completed successfully
- Check Vercel deployment logs

### Email Issues

**Problem**: OTP emails not sending
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check `EMAIL_USER` and `EMAIL_PASSWORD` are set in Render
- Enable "Less secure app access" if using regular password (not recommended)

---

## Post-Deployment Checklist

- [ ] Backend is accessible and health check returns 200
- [ ] Frontend loads without console errors
- [ ] Organizer signup/login works
- [ ] Event creation works
- [ ] Event public page is accessible
- [ ] User registration works
- [ ] OTP email is received
- [ ] Ticket generation works
- [ ] Manual approval flow works
- [ ] Database is storing data correctly

---

## Updating Your Application

### Update Backend

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Render will automatically redeploy

### Update Frontend

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```
3. Vercel will automatically redeploy

---

## Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### For Render (Backend)

1. Go to your service in Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your custom domain
4. Update DNS records as instructed

---

## Cost Considerations

**Current Setup (Free Tier):**
- MongoDB Atlas: 512MB storage (free forever)
- Render: 750 hours/month (free, but sleeps after inactivity)
- Vercel: Unlimited deployments (free for personal projects)

**Limitations:**
- Render free tier: Service sleeps after 15 minutes of inactivity (cold start ~30 seconds)
- MongoDB Atlas: 512MB storage limit
- Vercel: 100GB bandwidth/month

**Upgrade Recommendations:**
- If you need 24/7 uptime: Upgrade Render to paid tier ($7/month)
- If you need more storage: Upgrade MongoDB Atlas ($9/month for 2GB)

---

## Security Best Practices

1. **Never commit `.env` files** to GitHub
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate secrets regularly** (every 3-6 months)
4. **Monitor logs** for suspicious activity
5. **Keep dependencies updated**: `npm audit fix`
6. **Use HTTPS only** (both platforms provide this by default)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in Render/Vercel
3. Check MongoDB Atlas monitoring
4. Verify all environment variables are set correctly

---

**Congratulations! Your event ticketing application is now live! 🎉**
