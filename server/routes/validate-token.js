// In your backend route file (e.g., tokenValidation.js)
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    res.json({ valid: true, userId: decodedToken.userId });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token is invalid or expired' });
  }
});

module.exports = router;
