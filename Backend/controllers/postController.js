const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Create post
const createPost = async (req, res) => {
  try {
    const { caption, media } = req.body;
    const newPost = new Post({
      userId: req.user.id,
      caption,
      media
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit post
const editPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const { caption, media } = req.body;

    if (caption) post.caption = caption;
    
    if (media) {
      if (!Array.isArray(media) || media.length === 0 || media.length > 10) {
        return res.status(400).json({ message: 'Post must include between 1 and 10 media items' });
      }

      const validTypes = ['image', 'video'];
      const validMedia = media.every(item => 
        validTypes.includes(item.type) && item.url
      );

      if (!validMedia) {
        return res.status(400).json({ message: 'Invalid media format' });
      }

      post.media = media;
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating post' });
  }
};

// Fetch a single post
const getPostById = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture').populate({
        path: 'comments',
        populate: [{ path: 'userId', select: 'username profilePicture'},
          { path: 'replies', populate: { path: 'userId', select: 'username profilePicture' }}]
      });

      if(!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: 'Server error'});
    }
};

// Delete post and all associated comments
const deletePost = async (req, res, next) => {
    try {
      const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Delete all comments and their replies
      const comments = await Comment.find({ postId: req.params.id });
      for (const comment of comments) {
        await Comment.deleteMany({ parentComment: comment._id });
      }
      await Comment.deleteMany({ postId: req.params.id });
      
      // Delete the post
      await post.deleteOne();
      
      res.json({ message: 'Post and all associated content deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post' });
    }
};

// Get feed posts with pagination
const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user.id);
    const following = currentUser.following;
    following.push(req.user.id); // Include user's own posts

    const posts = await Post.find({ userId: { $in: following } })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ userId: { $in: following } });
    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPost, editPost, getPostById, deletePost, getFeedPosts };