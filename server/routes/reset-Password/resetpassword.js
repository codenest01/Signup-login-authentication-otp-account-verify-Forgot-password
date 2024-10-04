const express = require('express');
const router = express.Router();
const Register = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Apply the rate limiting middleware to the reset-password route
router.post("/reset-password", limiter, async (req, res) => {
  const { otp, newPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(400).json({ msg: "Reset token is missing" });
  }

  try {
    // Verify the reset JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user using the decoded _id from the token
    const user = await Register.findOne({ _id: decoded._id, resetJwt: token });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isOtpValid = await bcrypt.compare(otp, user.verifyCode);
    
    if (!isOtpValid) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Hash the new password
    const securePassword = await bcrypt.hash(newPassword, 10);

    // Update password, reset OTP, and clear the resetJwt
    await Register.findOneAndUpdate(
      { _id: user._id }, 
      { password: securePassword, verifyCode: null, resetJwt: null }, // Reset OTP and resetJwt
      { new: true }
    );

    res.status(200).json({ msg: "Password updated successfully" });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: "Reset token has expired" });
    }
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
  