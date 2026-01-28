# Deployment Guide - Event Ticketing Application

## Prerequisites

- GitHub account
- Render account (for backend)
- Vercel account (for frontend)
- MongoDB Atlas account (for database)
- Gmail account with App Password (for email service)

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs (0.0.0.0/0) for development
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/event-ticketing?retryWrites=true&w=majority`

## Step 2: Email Service Setup (Gmail App Password)

1. Enable 2-Step Verification on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new app password for "Mail"
4. Copy the 16-character password (remove spaces)
5. Save for later use

## Step 3: Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: event-ticketing-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate with `openssl rand -base64 32` or use any strong random string
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASSWORD`: Your Gmail App Password (16 characters)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL (add after frontend deployment)
   - `PORT`: `5000` (Render will override this automatically)
7. Click "Create Web Service"
8. Wait for deployment to complete
9. Copy your backend URL (e.g., `https://event-ticketing-backend.onrender.com`)

## Step 4: Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL + `/api`
   - Example: `https://event-ticketing-backend.onrender.com/api`
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your frontend URL (e.g., `https://event-ticketing.vercel.app`)

## Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Save changes (this will trigger a redeploy)

## Step 6: Testing

1. Visit your frontend URL
2. Test the following flows:
   - **Signup**: Create a new account
   - **Login**: Log in with your account
   - **Create Event**: Create a test event
   - **Register for Event**: Test OTP flow
   - **View Ticket**: Check ticket generation

## Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to MongoDB"
- **Solution**: Check MongoDB Atlas connection string and IP whitelist

**Problem**: "Email not sending"
- **Solution**: Verify Gmail App Password is correct (16 characters, no spaces)

**Problem**: "CORS errors"
- **Solution**: Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly

### Frontend Issues

**Problem**: "Network Error" or "Failed to fetch"
- **Solution**: Check `VITE_API_URL` environment variable in Vercel

**Problem**: "404 on refresh"
- **Solution**: Vercel should handle this automatically with Vite, but verify build settings

### Performance Issues

**Problem**: "Slow first request (cold start)"
- **Solution**: Render free tier has cold starts. Consider:
  - Upgrading to paid tier
  - Using UptimeRobot to ping `/health` endpoint every 10 minutes

## Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-ticketing
JWT_SECRET=your_random_secret_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Post-Deployment Checklist

- [ ] Backend deployed successfully on Render
- [ ] Frontend deployed successfully on Vercel
- [ ] All environment variables configured
- [ ] CORS configured correctly
- [ ] Signup flow works
- [ ] Login flow works
- [ ] Event creation works
- [ ] OTP email sending works
- [ ] Event registration works
- [ ] Ticket viewing works

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
