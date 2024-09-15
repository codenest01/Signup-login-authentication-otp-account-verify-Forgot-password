const express = require('express');
const router = express.Router();
const Register = require('../models/User'); 
const { body, validationResult } = require('express-validator'); 

// Validation and sanitization middleware
const validationRules = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 3, max: 6 }).withMessage('Password must be between 3 and 6 characters')
];

router.post('/signup', validationRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create a new user
    const user = new Register({ username, email, password });
    await user.save();
    res.json({ message: 'User created successfully'});
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
