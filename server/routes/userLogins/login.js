const express = require('express');
const router = express.Router();
const Register = require('../../models/User'); // Assuming Register model exists for user data
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.post('/login', async (req, res) => {
  const { email, password } = req.body;   

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isVerified) {
      // Generate a verification token for the unverified user
      const verifyToken = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(403).json({
        error: 'User not verified. Please verify your account.',
        redirectTo: '/verify',
        verifyToken,
        verifyTokenEmail: user.email
      });
    }

    // Use the comparePassword method to check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    user.jwtToken = jwtToken;
    await user.save();


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


// Export the router to be used in the main application
module.exports = router;