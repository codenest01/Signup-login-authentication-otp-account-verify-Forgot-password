const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User'); 
const resetPasswordMiddleware = require('../../middleware/resetPasswordMiddleware'); 
const router = express.Router();

// POST /reset-password - Route to handle the reset password
router.post('/reset-password', resetPasswordMiddleware, async (req, res) => {
    const { newPassword } = req.body; 
    const { userId } = req.user; // userId from middleware after token verification

    console.log('User ID from token:', userId); // Debugging line

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found in the database'); // Debugging line
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        // In your reset password route
const hashedPassword = await bcrypt.hash(newPassword, 10);
console.log('New hashed password:', hashedPassword); 


        // Update the password and clear the jwtToken
        user.password = hashedPassword;
        user.jwtToken = null; // Clear the JWT token after a password change
        await user.save();

        return res.status(200).json({ message: 'Password has been successfully updated' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'An error occurred while updating the password' });
    }
});

module.exports = router;