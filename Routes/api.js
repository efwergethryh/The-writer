const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
const chatController = require('../controllers/chatController')
const { checkUser } = require('../Middleware/AuthMiddleware');
const userController = require('../controllers/userController')
router.post('/send-message', checkUser, chatController.send_message)
router.delete('/remove-all', checkUser, chatController.remove_allchats)
router.delete('/remove-chats', checkUser, chatController.remove_allconvs)
router.get('/conversation/:id', checkUser, chatController.Conversation);
router.delete('/conversation/:id', checkUser, chatController.delete_single_conversation)
router.get('/conversation/:id/messages', checkUser, chatController.messages);
router.get('/conversations', checkUser, chatController.conversations)
router.post('/notification', checkUser, chatController.new_notification)
router.post('/pay', userController.checkout);
router.post('/charge',userController.charge);

router.get('/client_token', userController.generate_token);
module.exports = router