import express from 'express';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create event (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, date, venue, ticketLimit, approvalMode } = req.body;

    const event = new Event({
      title,
      description,
      date,
      venue,
      ticketLimit,
      approvalMode,
      organizerId: req.userId
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get organizer's events (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.userId }).sort({ createdAt: -1 });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event details (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name email');
    if (!event)
 {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event registrations (protected)
router.get('/:id/registrations', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const registrations = await Registration.find({ eventId: req.params.id }).sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
