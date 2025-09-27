const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const comments = await Comment.find({ 
      post: req.params.postId, 
      status: 'approved',
      parentComment: null 
    })
      .populate('author', 'username')
      .populate({
        path: 'post',
        select: 'title slug'
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ 
          parentComment: comment._id, 
          status: 'approved' 
        })
          .populate('author', 'username')
          .sort({ createdAt: 1 });
        
        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    const total = await Comment.countDocuments({ 
      post: req.params.postId, 
      status: 'approved',
      parentComment: null 
    });

    res.json({
      comments: commentsWithReplies,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', [auth], [
  body('content').notEmpty().trim().withMessage('Comment content is required'),
  body('postId').notEmpty().withMessage('Post ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, postId, parentCommentId } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify parent comment exists if provided
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    // Check for duplicate comment (same user, same post, same content)
    const existingComment = await Comment.findOne({
      author: req.user._id,
      post: postId,
      content: content.trim()
    });

    if (existingComment) {
      return res.status(400).json({ message: 'You have already posted this comment' });
    }

    const comment = new Comment({
      content: content.trim(),
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username')
      .populate('post', 'title slug');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate comment detected' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment (only by comment author or admin)
router.put('/:id', [auth], [
  body('content').notEmpty().trim().withMessage('Comment content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.content = content.trim();
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username')
      .populate('post', 'title slug');

    res.json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (only by comment author or admin)
router.delete('/:id', [auth], async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete comment and its replies
    await Comment.deleteMany({ 
      $or: [
        { _id: req.params.id },
        { parentComment: req.params.id }
      ]
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments (Admin only)
router.get('/admin', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};

    const comments = await Comment.find(query)
      .populate('author', 'username')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments(query);

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment status (Admin only)
router.patch('/:id/status', [auth, adminAuth], [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.status = status;
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username')
      .populate('post', 'title slug');

    res.json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
