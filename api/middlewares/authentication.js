// Authentication Middleware
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config/.env' });
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Authentication failed. Token not provided or invalid.');
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).send('Authentication failed. Invalid token.');
    }
}

module.exports = authenticateToken;