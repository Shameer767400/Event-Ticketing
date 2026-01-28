import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  ticketLimit: {
    type: Number,
    required: true,
    min: 1
  },
  approvalMode: {
    type: String,
    enum: ['auto', 'manual'],
    default: 'auto'
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries by organizer
eventSchema.index({ organizerId: 1 });

export default mongoose.model('Event', eventSchema);
