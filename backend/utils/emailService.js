import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, otp) => {
  // Always log OTP for debugging purposes
  console.log('=================================================');
  console.log(`OTP Generated for ${email}: ${otp}`);
  console.log('=================================================');

  // If Resend API key is not set, log to console for development
  if (!process.env.RESEND_API_KEY) {
    console.log('[DEV MODE] Email Service mocked - Resend API key not configured');
    return true;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Event Ticketing <onboarding@resend.dev>', // Use verified domain or resend.dev for testing
      to: [email],
      subject: 'Your Verification Code - Event Ticketing',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">You are one step away from completing your registration. Please use the verification code below:</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #6366f1; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          
          <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this code, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">Event Ticketing System</p>
        </div>
      `
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      console.log('=================================================');
      console.log('[FALLBACK - EMAIL FAILED]');
      console.log(`Reason: ${error.message}`);
      console.log(`To: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log('=================================================');
      return true; // Return true so frontend flow continues
    }

    console.log(`✅ OTP sent successfully to ${email} (Message ID: ${data?.id})`);
    return true;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    console.log('=================================================');
    console.log('[FALLBACK - EMAIL FAILED]');
    console.log(`Reason: ${error.message}`);
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('=================================================');
    return true; // Return true so frontend flow continues
  }
};
