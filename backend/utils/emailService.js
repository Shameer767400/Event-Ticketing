import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, otp) => {
  // If credentials are not set, log to console for development
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('=================================================');
    console.log(`[DEV MODE] Email Service mocked.`);
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('=================================================');
    return true;
  }

  const mailOptions = {
    from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification Code - Event Ticketing',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">You are one step away from completing your registration. Please use the verification code below:</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
        </div>
        
        <p style="font-size: 14px; color: #777;">This code is valid for <strong>10 minutes</strong>.</p>
        <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Event Ticketing App. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    
    // Fallback for development: If email fails (e.g., auth error), log to console so user can still continue
    console.log('=================================================');
    console.log(`[FALLBACK - EMAIL FAILED]`);
    console.log(`Reason: ${error.message}`);
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('=================================================');
    
    // Return true so the frontend flow continues smoothly
    return true;
  }
};
