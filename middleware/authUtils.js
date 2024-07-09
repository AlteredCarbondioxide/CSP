const jwt = require('jsonwebtoken');

const authenticateToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.customerId;
    } catch (err) {
        return null;
    }
};

module.exports = { authenticateToken };
