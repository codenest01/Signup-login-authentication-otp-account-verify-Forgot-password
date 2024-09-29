const express = require('express');
const router = express.Router();
const Register = require('../../models/User');
const jwt = require('jsonwebtoken');


router.get('/user-data', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await Register.findById(decoded._id).select('-password'); // Exclude password
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  module.exports = router;