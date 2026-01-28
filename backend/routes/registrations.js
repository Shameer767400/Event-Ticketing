import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import OTP from '../models/OTP.js';
import { generateOTP, sendOTP } from '../utils/emailService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Request OTP for registration
router.post('/request-otp', async (req, res) => {
  try {
    const { eventId, userEmail } = req.body;

    // Validate inputs
    if (!eventId || !userEmail) {
      return res.status(400).json({ error: 'Event ID and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check ticket limit
    const approvedCount = await Registration.countDocuments({ 
      eventId, 
      status: 'approved' 
    });
    
    if (approvedCount >= event.ticketLimit) {
      return res.status(400).json({ error: 'Sorry, this event is fully booked' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpDoc = new OTP({
      email: userEmail.toLowerCase(),
      otp,
      eventId
    });

    await otpDoc.save();
    
    // Send email asynchronously - don't wait for completion
    // This improves response time from 3-5s to <1s
    sendOTP(userEmail, otp).catch(err => {
      console.error('Email sending error:', err.message);
      // Email errors are logged but don't block the response
    });

    res.json({ 
      message: 'OTP sent to your email. Please check your inbox.', 
      otpId: otpDoc._id 
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP and Complete Registration
router.post('/verify-otp', async (req, res) => {
  try {
    const { otpId, otpCode, userName, userPhone } = req.body;

    // Validate all inputs
    if (!otpId || !otpCode || !userName || !userPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate name
    if (userName.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    // Validate phone number (only numbers)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(userPhone)) {
      return res.status(400).json({ error: 'Phone number must be 10-15 digits (numbers only)' });
    }

    // Validate OTP code format
    if (otpCode.length !== 6 || !/^[0-9]{6}$/.test(otpCode)) {
      return res.status(400).json({ error: 'OTP must be a 6-digit code' });
    }

    // Find OTP
    const otpRecord = await OTP.findById(otpId);
    if (!otpRecord) {
      return res.status(400).json({ error: 'OTP has expired or is invalid. Please request a new one.' });
    }

    if (otpRecord.otp !== otpCode) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check and try again.' });
    }

    // Get event details for approval mode
    const event = await Event.findById(otpRecord.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check ticket limit again (race condition check)
    const approvedCount = await Registration.countDocuments({ 
      eventId: event._id, 
      status: 'approved' 
    });
    
    if (approvedCount >= event.ticketLimit) {
      return res.status(400).json({ error: 'Sorry, this event is now fully booked' });
    }

    // Create registration
    const registration = new Registration({
      eventId: otpRecord.eventId,
      userName: userName.trim(),
      userEmail: otpRecord.email, // Use email from verified OTP record for security
      userPhone,
      status: event.approvalMode === 'auto' ? 'approved' : 'pending'
    });

    await registration.save();
    
    // Delete used OTP
    await OTP.findByIdAndDelete(otpId);

    res.status(201).json({
      message: event.approvalMode === 'auto' 
        ? 'Registration approved! Your ticket is ready.' 
        : 'Registration submitted! Waiting for organizer approval.',
      registration
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Approve registration (protected)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Check if user is the organizer
    const event = await Event.findById(registration.eventId);
    if (event.organizerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check ticket limit
    const approvedCount = await Registration.countDocuments({ 
      eventId: registration.eventId, 
      status: 'approved' 
    });
    
    if (approvedCount >= event.ticketLimit) {
      return res.status(400).json({ error: 'Event is full' });
    }

    registration.status = 'approved';
    await registration.save();

    res.json({ message: 'Registration approved', registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject registration (protected)
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Check if user is the organizer
    const event = await Event.findById(registration.eventId);
    if (event.organizerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    registration.status = 'rejected';
    await registration.save();

    res.json({ message: 'Registration rejected', registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ticket details (public)
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const registration = await Registration.findOne({ 
      ticketId: req.params.ticketId,
      status: 'approved'
    }).populate('eventId');

    if (!registration) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

