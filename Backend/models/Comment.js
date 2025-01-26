const mongoose = require('mongoose');

// Define the comment Schema
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // refers to the post on which the comment was made.
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
    trim: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  replies: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    default: [],
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Virtual fields
commentSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

commentSchema.virtual('repliesCount').get(function () {
  return this.replies.length;
});

// Enable virtual fields
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

// Middleware to update `updatedAt`
commentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
commentSchema.index({ userId: 1 });
commentSchema.index({ postId: 1 });
commentSchema.index({ createdAt: -1 });

// Create the Comment model from the schema
const Comment = mongoose.model("Comment", commentSchema);

// Export the Comment model so we can use it in other files
module.exports = Comment;
