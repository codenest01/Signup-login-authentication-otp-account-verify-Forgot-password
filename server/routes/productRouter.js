const express = require('express');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();


router.post('/products', ensureAuthenticated, (req, res) => { 
    res.status(200).json({
        msg: "User is authorized",
        email:req.user.email,
       
    });
});

module.exports = router;
