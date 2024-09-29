const jwt = require('jsonwebtoken');

const resetPasswordMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = { userId: decoded.id }; // Attach user ID to request
        next();
    });
};

module.exports = resetPasswordMiddleware;
