import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Document automatically deleted after 600 seconds (10 minutes)
  },
  // We store the registration data temporarily until verification
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },

});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
