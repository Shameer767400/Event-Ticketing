# Event Ticketing Application

A full-stack event management platform built with the MERN stack. Organizers can create and manage events with automated or manual approval workflows, while users can register for events through a secure OTP-based verification system.

## 🚀 Live Demo

- **Frontend:** https://event-ticketing-assignment1.vercel.app
- **Backend API:** https://event-ticketing-4ohb.onrender.com

## ✨ Key Features

### For Event Organizers
- Secure authentication with JWT
- Create events with customizable details (title, description, date, venue, capacity)
- Choose approval mode: Automatic (instant tickets) or Manual (review registrations)
- Dashboard to view and manage all events
- Approve or reject registrations with real-time updates
- Track registration statistics

### For Attendees
- Public event pages accessible via shareable links
- Secure registration with email OTP verification
- Instant ticket generation for auto-approved events
- Digital tickets with unique IDs
- Print-ready ticket design

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API communication
- Modern CSS with glassmorphism effects

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Resend for email delivery
- RESTful API architecture

## 📦 Project Structure

```
event-ticketing-app/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Email service
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── pages/       # React components
│   │   ├── utils/       # API configuration
│   │   └── index.css    # Styling
│   └── package.json
└── render.yaml          # Deployment config
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Resend API key (for email)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
RESEND_API_KEY=your_resend_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

npm start
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:5000/api

npm run dev
```

## 🌐 Deployment

**Backend:** Deployed on Render  
**Frontend:** Deployed on Vercel  
**Database:** MongoDB Atlas

Environment variables are configured in respective platforms.

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Email verification via OTP
- Input validation on client and server
- CORS protection
- Secure HTTP-only cookies support

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create organizer account
- `POST /api/auth/login` - Login

### Events
- `POST /api/events` - Create event (protected)
- `GET /api/events` - Get organizer's events (protected)
- `GET /api/events/:id` - Get event details (public)

### Registrations
- `POST /api/registrations/request-otp` - Request OTP for registration
- `POST /api/registrations/verify-otp` - Verify OTP and complete registration
- `GET /api/registrations/ticket/:ticketId` - View ticket (public)
- `PUT /api/registrations/:id/approve` - Approve registration (protected)
- `PUT /api/registrations/:id/reject` - Reject registration (protected)

## 🎨 Design Highlights

- Modern dark theme with vibrant accents
- Glassmorphism UI effects
- Responsive design for all devices
- Smooth animations and transitions
- Password strength indicators
- Real-time form validation

## 📄 License

This project was developed as part of a technical assessment.

---

**Note:** For security reasons, environment variables and API keys are not included in this repository. Contact the developer for deployment configuration details.
