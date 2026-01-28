# Resend Email Service Setup

## Step 1: Get Resend API Key

1. Go to https://resend.com/signup
2. Sign up (free - 3,000 emails/month)
3. Verify your email
4. Go to **API Keys** → **Create API Key**
5. Copy the key (starts with `re_`)

## Step 2: Add to Render

1. Go to Render Dashboard → Your backend service
2. Click **Environment** tab
3. Add environment variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxxxxxxxxxxx` (your API key)
4. **Save** (will auto-redeploy)

## Step 3: Test

After Render redeploys (2-3 minutes):
1. Go to your event page
2. Click "Send OTP"
3. Email should arrive in 5-10 seconds!

## Why Resend?

- ✅ **Reliable** - Works perfectly on cloud platforms
- ✅ **Fast** - Emails arrive in seconds
- ✅ **Free** - 3,000 emails/month (plenty for your needs)
- ✅ **Simple** - No complex SMTP configuration
- ✅ **No timeouts** - Unlike Gmail on Render

## Code Changes Made

- ✅ Installed `resend` package
- ✅ Replaced Nodemailer with Resend API
- ✅ Removed `nodemailer` dependency
- ✅ Updated environment variable from `EMAIL_USER`/`EMAIL_PASSWORD` to `RESEND_API_KEY`
