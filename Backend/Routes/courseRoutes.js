const express = require('express');
const courseController = require('../controllers/courseController');

const courseRoutes = express.Router();

// Corrected the route references to use courseRoutes instead of userRoutes
courseRoutes.route('/getDetails').get(courseController.getDetails);
courseRoutes.route('/addCourse').post(courseController.addCourse);

module.exports = courseRoutes;
