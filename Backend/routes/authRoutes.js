const express = require('express');
const { signup, verifyEmail, resendVerificationEmail, login, logout } = require('../controllers/authController');
const { forgetPassword, resetPassword } = require('../controllers/passwordResetController');
const { authenticate, authorize } = require('../middleware/authenticate');
const router = express.Router();

// Public routes (User/ Admin signup and login)
router.post('/signup', signup);
router.post('/login', login);

// Verify email route
router.get('/verify-email/:token', verifyEmail);

// Resend verification email route
router.post('/resend-verification-email', resendVerificationEmail);

// Request password reset route
router.post('/request-password-reset', forgetPassword);

// Reset password route
router.post('/reset-password', resetPassword);

// Protected route
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});
router.get('/user', authenticate, (req, res) => {
  res.status(200).json({ message: 'Welcome User!', user: req.user });
});
router.post('/logout', authenticate, logout);

// Error-handling middleware
router.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = router;
