const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9_]+$/,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, //Enforce Password Security
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: { type: Boolean, default: false },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '', // Empty string
      maxlength: 150,
    },
    // Array of followers, each referencing another user's ObjectId
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
    // Array of users that this user is following
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Flag to indicate whether the user account is deactivated
    isDeleted: {
      type: Boolean,
      default: false, // By default, accounts are active
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

// Virtual Fields
// the number of followers
userSchema.virtual('followerCount').get(function () {
  return this.followers.length;
});

// the number of users the current user is following
userSchema.virtual('followingCount').get(function () {
  return this.following.length;
});

// Enable virtuals when the model is converted to JSON or plain objects
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });


  // Middleware to hash the password before saving the user document.
  // This ensures the password is stored securely in the database.

userSchema.pre('save', async function (next) {
  // If the password hasn't been modified, skip hashing
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save the user
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
});

// Define a method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Indexes for optimized query performance
userSchema.index({ username: 1 }, { unique: true }); // Ensure unique usernames
userSchema.index({ email: 1 }, { unique: true }); // Ensure unique emails
userSchema.index({ createdAt: -1 }); // Optimize sorting by creation date

// Create the User model from the Schema
const User = mongoose.model('User', userSchema);

// Export the User model to use it in other files
module.exports = User;
