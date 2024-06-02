const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
const chatController = require('../controllers/chatController')
const { checkUser } = require('../Middleware/AuthMiddleware');
const { chat } = require('googleapis/build/src/apis/chat');

router.get('/chats', checkUser, chatController.chat_page)

module.exports = router
