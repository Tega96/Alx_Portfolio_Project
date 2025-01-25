const mongoose = require('mongoose');

/* This will store temporary tokens for email verification and password reset. */
const TokenGeneratorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token expires in 1 hour
});

const GeneratedToken = mongoose.model('GeneratedToken', TokenGeneratorSchema);

module.exports = GeneratedToken;
