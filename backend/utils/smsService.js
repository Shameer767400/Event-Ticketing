// SMS Service using console logging (for development)
// In production, integrate with Twilio, AWS SNS, or other SMS providers

export const sendOTPSMS = async (phone, otp, eventTitle) => {
  // Development mode: Log OTP to console
  console.log('\n' + '='.repeat(60));
  console.log('📱 SMS OTP (DEVELOPMENT MODE)');
  console.log('='.repeat(60));
  console.log(`📞 To: ${phone}`);
  console.log(`🎫 Event: ${eventTitle}`);
  console.log(`🔐 OTP Code: ${otp}`);
  console.log(`⏰ Valid for: 10 minutes`);
  console.log('='.repeat(60) + '\n');
  
  return { success: true, devMode: true };
};

// For production with Twilio:
/*
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTPSMS = async (phone, otp, eventTitle) => {
  try {
    await client.messages.create({
      body: `Your OTP for ${eventTitle} is: ${otp}. Valid for 10 minutes. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return { success: true };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};
*/
