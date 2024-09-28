const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Register = require('../../models/User');
const bcrypt = require('bcrypt');

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check if user exists
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // OTP resend cooldown logic (1 minute)
    const resendCooldown = 60 * 1000; // 1 minute cooldown
    if (user.lastOtpSentAt && Date.now() - user.lastOtpSentAt < resendCooldown) {
      return res.status(429).json({ error: 'Please wait before requesting a new OTP.' });
    }

    // Generate OTP (6-digit random code)
    const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Set OTP and expiration time (5-minute validity)
    user.verifyCode = hashedOtp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    user.lastOtpSentAt = Date.now();
    await user.save();

    // Send email with the OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email!' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;