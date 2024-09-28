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

// Send verification code (with OTP expiry and resend cooldown)
router.post('/verify', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent OTP spam (resend cooldown of 1 minute)
    const resendCooldown = 60 * 1000; // 1 minute cooldown
    if (user.lastOtpSentAt && user.lastOtpSentAt + resendCooldown > Date.now()) {
      return res.status(429).json({ error: 'Please wait before requesting a new OTP.' });
    }

    const otpExpiryTime = 5 * 60 * 1000; // OTP valid for 5 minutes
    const code = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-char OTP
    const hashedCode = await bcrypt.hash(code, 10);
    user.verifyCode = hashedCode;


    user.otpExpiresAt = Date.now() + otpExpiryTime;
    user.lastOtpSentAt = Date.now(); // Log the time OTP was sent
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your OTP is ${code}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification code sent!' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
