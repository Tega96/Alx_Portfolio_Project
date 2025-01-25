const mongoose = require('mongoose');

/*
* The purpose of this model is to store tokens that have been invalidated, 
* after a user logs out or session expiration, and automatically remove 
* them from the database once they expire
*/

// Define the schema for blacklisted tokens
const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true, // Token will automatically expire after a certain time
  },
});

// Add TTL (Time-To-Live) index for automatic expiration, 
// MongoDB periodically checks the expiresAt field and deletes documents that have expired.
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Validate that expiresAt is a future date
tokenBlacklistSchema.path('expiresAt').validate(function (value) {
  return value > new Date();
}, 'Expiration date must be in the future.');

// Export the TokenBlacklist model
const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
module.exports = TokenBlacklist;
