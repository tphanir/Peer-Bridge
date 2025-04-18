// Routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Course review routes - all without auth middleware
router.get('/reviews', courseController.getDetails);
router.post('/course', courseController.addCourse);

// New routes for updated functionality
router.get('/reviews/course', courseController.getDetails);
router.post('/reviews/:reviewId/toggle-like', courseController.toggleLike);
router.get('/reviews/:reviewId/like-status', courseController.checkLikeStatus);

module.exports = router;