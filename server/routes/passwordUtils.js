const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/compare-passwords', async (req, res) => {
  const { plainPassword, hashedPassword } = req.body; // Get plain and hashed passwords from the request body

  try {
    console.log('Plain password:', plainPassword);
    console.log('Hashed password:', hashedPassword);

    // Compare the provided plain password with the hashed password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    // Return whether the passwords match (true or false)
    res.status(200).json({ match: isMatch });
  } catch (error) {
    console.error('Error comparing passwords:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
