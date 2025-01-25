const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GeneratedToken = require('../models/GeneratedToken');
const { sendEmail } = require('../services/emailServices');
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

        // Generate email verification token
        const verificationToken = generateToken({ userId: user._id }, '1h'); // token expires in hour

        // save the token
        await GeneratedToken.create({
            userId: user._id,
            token: verificationToken,
        });

        // send verification email
        const verificationLink = `http://yourapp.com/verify-email/${verificationToken}`;
        await sendEmail({
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Please click the link below to verify your email:</p> 
        <a href="${verificationLink}">Verify Email</a>`,
        });

        res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// verify email controller
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find the token in the GeneratedToken
        const emailToken = await GeneratedToken.findOne({ token });
        if (!emailToken) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Find the user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Mark the user as verified
        user.isVerified = true;
        await user.save();

        // Delete the token from the GeneratedToken collection
        await GeneratedToken.deleteOne({ token });

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (err) {
        console.error('Error during email verification:', err);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Resend verification email controller
const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        // Generate a new email verification token
        const verificationToken = generateToken({ userId: user._id }, '1h');

        // Save the new token in the GeneratedToken collection
        await GeneratedToken.create({
            userId: user._id,
            token: verificationToken,
        });

        // Send the new verification email
        const verificationLink = `http://snapgram.com/verify-email/${verificationToken}`;
        await sendEmail({
            to: email,
            subject: 'Verify Your Email',
            html: `
          <p>Please click the link below to verify your email:</p>
          <a href="${verificationLink}">Verify Email</a>
        `,
        });

        res.status(200).json({ message: 'Verification email sent. Please check your email.' });
    } catch (err) {
        console.error('Error during resend verification email:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// User login controller
const login = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User Not Found' });

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email to login.' });
        }
  
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials.' });

        // Token expiry based on role and rememberMe
        let tokenExpiry;
        if (user.role === 'admin') {
            tokenExpiry = '1h'; // Admins always get 1-hour tokens
        } else if (rememberMe) {
            tokenExpiry = '10d'; // 10 days tokens if "Remember Me" is checked
        } else {
            tokenExpiry = '1d'; // 1 day tokens by default
        }
        
        // Generate JWT
        const token = generateToken({ id: user._id, email: user.email, role: user.role, }, tokenExpiry);
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { id: user._id, username: user.username, role: user.role },
        });
    } catch (err) {
        console.error('Error during login:', err)
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

module.exports = { signup, verifyEmail, resendVerificationEmail, login, logout };
