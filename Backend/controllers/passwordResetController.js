const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const GeneratedToken = require('../models/GeneratedToken');
const { sendEmail } = require('../services/emailServices');
const { generateToken } = require('../services/jwtServices');

// Request password reset controller
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a password reset token
    const resetToken = generateToken({ userId: user._id }, '1h');

    // Save the token in the GeneratedToken
    await GeneratedToken.create({
      userId: user._id,
      token: resetToken,
    });

    // Send the reset email
    const resetLink = `http://yourapp.com/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: `
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    res.status(200).json({ message: 'Password reset email sent. Please check your email.' });
  } catch (err) {
    console.error('Error during password reset request:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the token in the GeneratedToken
    const emailToken = await GeneratedToken.findOne({ token });
    if (!emailToken) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the token from the GeneratedToken
    await GeneratedToken.deleteOne({ token });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { forgetPassword, resetPassword };