const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../services/jwtServices');
const TokenBlacklist = require('../models/TokenBlacklist');

// User signup controller
const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Ensure role is valid
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }
    // Check for duplicate email or username
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    // Create a new user
    const user = new User({ username, email, password, role: role || 'user' }); // Default to 'user' if no role is provided
    await user.save();
    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email });
    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (err) {
    console.error('Error during signup:', err); // Log the error on the server
    res.status(500).json({ message: 'Internal server error.' }); // Generic message for the client
  }
};

// User login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User Not Found' });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials.' });

    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email, role: user.role, });
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login.', err });
  }
};

// User logout
const logout = async (req, res) => {
  // Extracts the JWT from the Authorization header, contains the token in the format Bearer <token>
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'No token provided.' });
  }

  try {
    // Decodes the JWT to extract its payload: user ID, expiration time
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
    const expiresAt = new Date(decoded.exp * 1000); // Convert expiration time to a Date object
    // Add token to the blacklist to invalidate it and prevent further use.
    await new TokenBlacklist({ token, expiresAt }).save();
    res.status(200).json({ message: 'Logout successful.' });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Error during logout.', error });
  }
};

module.exports = { signup, login, logout };
