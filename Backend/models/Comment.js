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
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  repliesCount: {
    type: Number,
    default: 0
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

// update counts pre-save
commentSchema.pre('save', function(next) {
    if (this.isModified('likes')) {
      this.likesCount = this.likes.length;
    }
    if (this.isModified('replies')) {
      this.repliesCount = this.replies.length;
    }
    this.updatedAt = Date.now();
    next();
});

// Create the Comment model from the schema
const Comment = mongoose.model("Comment", commentSchema);

// Export the Comment model so we can use it in other files
module.exports = Comment;
