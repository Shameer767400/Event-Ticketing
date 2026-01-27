# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB running locally or MongoDB Atlas connection string

## Setup & Run

### 1. Backend Setup
```bash
cd backend
npm install
# MongoDB will connect to: mongodb://localhost:27017/event-ticketing
npm start
```
Backend runs on: **http://localhost:5001**

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

## Test the App

### Option 1: Use the Web Interface
1. Open http://localhost:5173
2. Click "Get Started" to sign up
3. Create an event
4. Share the event link with users

### Option 2: Run API Tests
```bash
chmod +x test-api.sh
./test-api.sh
```

## Key Routes

- `/` - Landing page
- `/signup` - Organizer signup
- `/login` - Organizer login
- `/dashboard` - Organizer dashboard
- `/create-event` - Create new event
- `/event/:id` - Public event page (share this!)
- `/event/:id/manage` - Manage registrations
- `/ticket/:ticketId` - View ticket

## Default Configuration

- Backend Port: 5001
- Frontend Port: 5173
- MongoDB: localhost:27017/event-ticketing
- JWT Secret: event_ticketing_secret_key_2026

## Troubleshooting

**MongoDB not connected?**
```bash
# Start MongoDB
mongod
```

**Port already in use?**
- Change PORT in `backend/.env`
- Update baseURL in `frontend/src/utils/api.js`

**CORS issues?**
- Ensure backend is running on port 5001
- Check browser console for errors

## Next Steps

1. ✅ Test the complete flow
2. 📦 Initialize Git repository
3. 🚀 Deploy to production (optional)

Enjoy your Event Ticketing App! 🎉
