# Event Ticketing App - MERN Stack

A modern, full-stack event ticketing application built with MongoDB, Express, React, and Node.js. Organizers can create events with auto or manual approval modes, manage registrations, and users can register for events and receive digital tickets.

## ✨ Features

### Organizer Features
- 🔐 Secure signup and login with JWT authentication
- 🎫 Create events with customizable details (title, description, date, venue, ticket limit)
- ⚡ Choose approval mode: Auto (instant tickets) or Manual (review each registration)
- 📊 View all created events in a dashboard
- ✅ Manage registrations: approve or reject attendees
- 📈 Track registration statistics (pending, approved, rejected)

### User Features
- 🌐 Access public event pages via shareable links
- 📝 Register for events with simple form (name, email, phone)
- 🎉 Instant ticket generation for auto-approval events
- ⏳ Pending status for manual-approval events
- 🎫 Beautiful digital tickets with unique ticket IDs
- 🖨️ Print-ready ticket design

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with modern design system (glassmorphism, gradients, animations)

## 📦 Project Structure

```
event-ticketing-app/
├── backend/
│   ├── models/          # MongoDB schemas (User, Event, Registration)
│   ├── routes/          # API routes (auth, events, registrations)
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── utils/       # API utilities
│   │   ├── App.jsx      # Main app with routing
│   │   └── index.css    # Design system
│   └── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder:
```env
MONGODB_URI=mongodb://localhost:27017/event-ticketing
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage Guide

### For Organizers

1. **Sign Up**: Create an account at `/signup`
2. **Log In**: Access your dashboard at `/login`
3. **Create Event**: Click "Create Event" and fill in:
   - Event title and description
   - Date and time
   - Venue location
   - Ticket limit
   - Approval mode (auto/manual)
4. **Manage Registrations**: View registrations and approve/reject as needed
5. **Share Event**: Copy the event link (`/event/:id`) to share with attendees

### For Users

1. **Access Event**: Open the public event link shared by organizer
2. **Register**: Fill in your name, email, and phone number
3. **Get Ticket**: 
   - Auto-approval: Instant ticket with unique ID
   - Manual-approval: Wait for organizer approval
4. **View Ticket**: Access your ticket at `/ticket/:ticketId`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create organizer account
- `POST /api/auth/login` - Login organizer

### Events
- `POST /api/events` - Create event (protected)
- `GET /api/events` - Get organizer's events (protected)
- `GET /api/events/:id` - Get event details (public)
- `GET /api/events/:id/registrations` - Get event registrations (protected)

### Registrations
- `POST /api/registrations` - Register for event (public)
- `PUT /api/registrations/:id/approve` - Approve registration (protected)
- `PUT /api/registrations/:id/reject` - Reject registration (protected)
- `GET /api/registrations/ticket/:ticketId` - Get ticket details (public)

## 🎨 Design Features

- **Dark Theme**: Modern dark mode with vibrant accent colors
- **Glassmorphism**: Frosted glass effect on cards and navigation
- **Smooth Animations**: Micro-interactions and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Premium Aesthetics**: Gradient buttons, custom badges, and elegant typography

## 🚢 Deployment

This application is ready for production deployment! See the comprehensive guides:

📘 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete step-by-step deployment guide
📋 **[DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md)** - Quick reference commands

### Quick Overview

**Recommended Stack:**
- **Backend**: [Render](https://render.com) - Free tier available
- **Frontend**: [Vercel](https://vercel.com) - Free tier available  
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free tier (512MB)

**Deployment Steps:**
1. Push code to GitHub
2. Set up MongoDB Atlas database
3. Deploy backend to Render with environment variables
4. Deploy frontend to Vercel with API URL
5. Update backend CORS with frontend URL

**Time Required**: ~30-45 minutes

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/event-ticketing
JWT_SECRET=your_jwt_secret_key
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: Example files are provided (`.env.example`, `.env.production.example`)

## 🤝 Contributing

This is a solo project for educational purposes. Feel free to fork and customize!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🐛 Troubleshooting

**MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct

**CORS Error**: Check that backend is running on port 5000 and frontend on 5173

**Auth Error**: Clear localStorage and try logging in again

**Port Already in Use**: Change PORT in backend `.env` or kill the process using the port

## 📧 Contact

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using MERN Stack
