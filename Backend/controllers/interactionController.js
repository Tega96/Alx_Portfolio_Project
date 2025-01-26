const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Like/Unlike post
const likePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.likes.includes(req.user.id)) {
        post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      } else {
        post.likes.push(req.user.id);
      }
      await post.save();
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
};

// Like/unlike comment
const toggleCommentLike = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      
      if (!comment) {
        return next(new AppError('Comment not found', 404));
      }

      if (comment.likes.includes(req.user.id)) {
        comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
      } else {
        comment.likes.push(req.user.id);
      }
      
      await comment.save();
      res.json({ 
        liked: !isLiked,
        likesCount: comment.likesCount
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

// Add comment or reply
const addComment = async (req, res, next) => {
    try {
      const { content, parentCommentId } = req.body;
      
      // Validate the post exists
      const post = await Post.findById(req.params.id);
      if (!post) {
        return next(new AppError('Post not found', 404));
      }
  
      const commentData = { postId: req.params.id, userId: req.user.id, content };
  
      // If it's a reply, validate and set parent comment
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          res.status(404).json({ message: 'Parent comment not found' });
        }
        commentData.parentComment = parentCommentId;
      }

      const comment = new Comment(commentData);
      await comment.save();
  
      // update parent comment if it's a reply
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: comment._id } });
      } else {
        // else add to post's comments
        post.comments.push(comment._id);
        await post.save();
      }
  
      // Populate user data before sending response
      await comment.populate('userId', 'username profilePicture');
      
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

// Update comment
const updateComment = async (req, res, next) => {
    try {
      const comment = await Comment.findOne({ _id: req.params.commentId, userId: req.user.id });
  
      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
      }
  
      comment.content = req.body.content;
      await comment.save();
  
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

// Delete comment and its replies
const deleteComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
      }
  
      // Check if user is comment author or post author
      const post = await Post.findById(comment.postId);
      if (comment.userId.toString() !== req.user.id && 
          post.userId.toString() !== req.user.id) {
        res.status(403).json({ message: 'not the author' });
      }

      // Delete all replies if it's a parent comment
      if (!comment.parentComment) {
        await Comment.deleteMany({ parentComment: comment._id });
        // Remove from post's comments array
        post.comments = post.comments.filter(id => id.toString() !== comment._id.toString());
        await post.save();
      } else {
        // Remove from parent comment's replies array
        const parentComment = await Comment.findById(comment.parentComment);
        if (parentComment) {
          parentComment.replies = parentComment.replies.filter(
            id => id.toString() !== comment._id.toString()
          );
          await parentComment.save();
        }
      }
  
      await comment.deleteOne();
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};
  
// Fetch all comments for a post
const getCommentsByPostId = async (req, res, next) => {
    try {
      // Get only top-level comments (no parent comment)
      const comments = await Comment.find({ postId: req.params.id, parentComment: null })
      .populate('userId', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: { path: 'userId', select: 'username profilePicture'} }).sort({ createdAt: -1 });
      
      res.json(comments);
    } catch (error) {
      res.status(200).json({ message: 'Server error' });
    }
};

module.exports = { likePost, toggleCommentLike, addComment, updateComment, deleteComment, getCommentsByPostId };