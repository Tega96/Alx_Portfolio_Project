const mongoose = require('mongoose');

// Define the post schema
const postSchema = new mongoose.Schema({
  // ID of the user who created the post
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId references a User document
    ref: 'User', // a relationship with the User model
    required: true,
  },
  // description of the post
  caption: {
    type: String,
    required: true,
    maxlength: 500,
  },
  // Array of media URLs (images/videos)
  media: {
    type: [
      {
        url: {
          type: String,
          required: true,
          validate: {
            validator: (value) => validator.isURL(value),
            message: 'Invalid URL',
          },
        },
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
      },
    ],
    default: [],
  },

  // Array of users who liked the post
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },

  // Array of comments associated with the post
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    default: [],
  }
}, { timestamps: true }
);

// Virtual field to calculate the number of likes
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual field to calculate the number of comments
postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Virtual field to calculate the number of media items
postSchema.virtual('mediaCount').get(function () {
  return this.media.length;
});

// Enable virtual fields
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Middleware to delete associated comments when a post is deleted
postSchema.pre('remove', async function (next) {
  try {
    await mongoose.model('Comment').deleteMany({ postId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware to log post creation
postSchema.pre('save', async function (next) {
  try {
    console.log(`A new post is being created by user: ${this.userId}`);
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes for optimized query performance
postSchema.index({ userId: 1 }); // Optimize queries by userId
postSchema.index({ createdAt: -1 }); // Optimize sorting by creation date
postSchema.index({ description: 'text' }); // Enable full-text search on post descriptions

// Create the Post model from the Schema
const Post = mongoose.model('Post', postSchema);

// Export the Post model to use it in other files
module.exports = Post;
