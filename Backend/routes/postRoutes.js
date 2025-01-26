const express = require('express');
const router = express.Router();
const { createPost, editPost, getPostById, deletePost, getFeedPosts } = require('../controllers/postController');
const { likePost, toggleCommentLike, addComment, updateComment, deleteComment, getCommentsByPostId } = require('../controllers/interactionController');
const { authenticate } = require('../middleware/authenticate');

// Post CRUD operations
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, editPost);
router.get('/:id', getPostById);
router.get('/feed', getFeedPosts);
router.delete('/:id', authenticate, deletePost);

// Post interactions
router.put('/:id/like', authenticate, likePost);
router.put('/:id/comments/:commentId/like', authenticate, toggleCommentLike);

// Comments
router.post('/:id/comments', authenticate, addComment);
router.put('/:id/comments/:commentId', authenticate, updateComment);
router.delete('/:id/comments/:commentId', authenticate, deleteComment);
router.get('/:id/comments', getCommentsByPostId);

module.exports = router;