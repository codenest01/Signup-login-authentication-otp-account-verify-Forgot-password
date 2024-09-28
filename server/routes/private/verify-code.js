const express = require('express');
const router = express.Router();
const Register = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const tempAuthenticaated = require('../../middleware/account-verify');

// Error handling function
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

router.post('/verify-code', tempAuthenticaated, async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return handleError(res, 400, 'Email and OTP are required');
  }

  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return handleError(res, 404, 'User not found');
    }

    if (user.otpExpiresAt < Date.now()) {
      return handleError(res, 400, 'OTP has expired. Please request a new one.');
    }

    const isMatch = await bcrypt.compare(otp, user.verifyCode);
    if (!isMatch) {
      return handleError(res, 400, 'Invalid OTP');
    }


    
    user.isVerified = true;
    user.verifyCode = null; // Clear the verification code
    user.otpExpiresAt = null; // Clear OTP expiration
    await user.save();


    // Include token in the response
    res.status(200).json({ message: 'Verification successful!'});
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
