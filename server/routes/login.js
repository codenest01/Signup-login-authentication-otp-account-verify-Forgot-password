const express = require('express');
const router = express.Router();
const Register = require('../models/User'); // Assuming Register model exists for user data
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {  // Use POST request for login
  const { email, password } = req.body;

  try {
    // Validate if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET_KEY, // Ensure SECRET_KEY is set in environment variables
      { expiresIn: '24h' }
    );

    // Send response with message and token
    res.status(200).json({
      message: 'Login successful',
      token: jwtToken,
      email,
      username: user.username
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
