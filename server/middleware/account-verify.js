const jwt = require('jsonwebtoken');
const Register = require('../models/User'); // Adjust the path as necessary

const tempAuthenticated = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find user by email
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '1h', // Token expiration time
    });

    // Attach the token to the response
    res.locals.token = token; // Save the token for the next middleware or route handler
    next(); // Call the next middleware or route handler
  } catch (err) {
    console.error('Error in tempAuthenticated:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = tempAuthenticated;
