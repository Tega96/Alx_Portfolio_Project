const express = require('express');
const router = express.Router();
const { createPost, editPost, getPostById, deletePost, getFeedPosts } = require('../controllers/postController');
const { likePost, toggleCommentLike, addComment, updateComment, deleteComment, getCommentsByPostId } = require('../controllers/interactionController');
const auth = require('../middleware/authenticate');

// Post CRUD operations
router.post('/', auth, createPost);
router.put('/:id', auth, editPost);
router.get('/:id', getPostById);
router.get('/:id', getFeedPosts);
router.delete('/:id', auth, deletePost);

// Post interactions
router.put('/:id/like', auth, likePost);
router.put('/:id/comments/:commentId/like', auth, toggleCommentLike);

// Comments
router.post('/:id/comments', auth, addComment);
router.put('/:id/comments/:commentId', auth, updateComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);
router.get('/:id/comments', getCommentsByPostId);

module.exports = router;