const express = require('express');
const chatController = require('../controllers/chatController');
const {protect} = require('../controllers/authController');

const chatRoutes = express.Router();

chatRoutes.route('/getMyMessages').get(protect,chatController.getMyMessages);
chatRoutes.route('/addMessage').post(protect,chatController.addMessage);
chatRoutes.route('/getReplies/:msgid').get(chatController.getReplies);
chatRoutes.route('/addReply/:msgid').post(protect,chatController.addReply);
chatRoutes.route('/getAllMessages').get(chatController.getAllMessages);


module.exports = chatRoutes;