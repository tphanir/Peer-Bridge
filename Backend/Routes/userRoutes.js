const express = require('express');
const authController = require('../controllers/authController');

const userRoutes = express.Router();

userRoutes.route('/signup').post(authController.signup);
userRoutes.route('/login').post(authController.login);


module.exports = userRoutes;