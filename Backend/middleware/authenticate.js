const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

// User Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header same as authController

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the req.user object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Role Authorization Middleware, it ensures the user has the required role to access a route.
const authorize = (role) => (req, res, next) => {
  // check if req.user.role exists
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: 'Access forbidden: User role not found.' });
  }
  // Check if User has required role
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient privileges.' });
  }
  next();
};

module.exports = { authenticate, authorize };
