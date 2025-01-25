const jwt = require('jsonwebtoken');

// Generate a JWT for a user
const generateToken = (payload) => {
  let expiresIn;

  if (payload.role === 'admin') {
    expiresIn = '1h';
  } else {
    expiresIn = '3d';
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn }); // Sign with secret and expiration time
};

// Verify the provided token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.err('Error verifying token:', err.message);
    throw new Error('Invalid or expired token.');
  }
};

module.exports = { generateToken, verifyToken };
