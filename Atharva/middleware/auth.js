const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ success: false, message: 'A token is required for authentication' });
  }
  
  try {
    const bearerToken = token.split(' ')[1];
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid Token' });
  }
  return next();
};

module.exports = verifyToken;
