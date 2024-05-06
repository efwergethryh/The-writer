const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
const chatController = require('../controllers/chatController')
const { checkUser } = require('../Middleware/AuthMiddleware');
const { chat } = require('googleapis/build/src/apis/chat');

router.get('/chats', checkUser, chatController.chat_page)
router.post('/api/send-message', checkUser, chatController.send_message)
router.delete('/api/remove-all', chatController.remove_allchats)
router.delete('/api/remove-chats', chatController.remove_allconvs)
router.get('/api/conversation/:id', chatController.Conversation);
router.delete('/api/conversation/:id', chatController.delete_single_conversation)
router.get('/api/conversation/:id/messages', checkUser, chatController.messages);
router.get('/api/conversations', checkUser, chatController.conversations)
router.post('/api/notification', checkUser, chatController.new_notification)
module.exports = router
