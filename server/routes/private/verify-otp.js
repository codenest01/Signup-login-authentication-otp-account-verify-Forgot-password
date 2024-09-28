const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package
const Register = require('../../models/User');

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    // Find user by email
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP is expired
    if (Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Compare provided OTP with the stored (hashed) OTP
    const isMatch = await bcrypt.compare(otp, user.verifyCode);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid, mark it as used
    user.isVerified = true;
    user.isOtpUsed = true;
    user.verifyCode = null;
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '1h', // Token expiration time
    });
    user.jwtToken = token; 
    await user.save(); 
    res.status(200).json({ message: 'OTP verified successfully!', token });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
