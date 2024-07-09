const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./authUtils');

module.exports = (req, res, next) => {
    console.log("test")
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};
