const message = require('../models/message')
const conversation = require('../models/conversation')
const bcrypt = require('bcrypt')
const user = require('../models/User')
const chat_page = async (req, res) => {

    try {
        const id = res.locals.user._id
        const conv = await conversation.find({ 'members': id }).exec()
        const Users = await user.find()
        // const Members = await Promise.all(conv.map(c => user.find({ _id: c.members }).exec()));

        const Members = await Promise.all(conv.map(async c => {
            const sender = await user.findById(c.members[0]);
            const receiver = await user.findById(c.members[1]);
            return [sender, receiver];
        }));
        console.log(conv);
        console.log(Members);
        res.render('Chats/chats', { conv, Members, Users })
    } catch (err) {
        console.log(err);
    }
}
const remove_allchats = async (req, res) => {
    try {
        await conversation.deleteMany({});

        res.status(200).json('deleted')
    } catch (error) {
        console.error("Error deleting records:", error);
    }
};
const remove_allconvs = async (req, res) => {
    try {
        await message.deleteMany({});

        res.status(200).json('deleted')
    } catch (error) {
        console.error("Error deleting records:", error);
    }
};


const Conversation = async (req, res) => {
    const id = req.params.id;
    
    try { 
        const _conversation = await conversation.findById({_id:id})
        const User = await user.findById({_id:_conversation.members[1]})
        res.status(200).json({_conversation, User});
     } catch (error) { 
        res.status(400).json('Error!' + error)
     }
}
const messages = async (req, res) => {
    const id = req.params.id;
    
    try { 
        const Messages = await message.find({conversation:id}).exec()
        console.log(Messages);
        res.status(200).json({Messages});
     } catch (error) { 
        res.status(400).json('Error!' + error)
     }
}
const send_message = async (req, res) => {
    try {

        //  console.log(`id ${req.body.conversation_id}`);   
        const existConversation = await conversation.findById(req.body.conversation_id);
        // console.log(`existConversation ${existConversation}`);

        const sender_id = res.locals.user._id
        const receiver_id = req.body.receiver_id

        if (existConversation) {
            const newMessage = new message({
                conversation: existConversation._id,
                sender: sender_id,
                text: req.body.text
            });
            await newMessage.save();
            res.status(200).json('sent successfully');
        } else {
            const Conversation = new conversation({
                members: [sender_id, receiver_id]
            });
            await Conversation.save();
            const newMessage = new message({
                conversation: Conversation._id,
                sender: sender_id,  
                text: req.body.text
            });
            await newMessage.save();

            res.status(200).json('sent successfully');
        }
    } catch (error) {
        res.status(400).json('Error!' + error)
    }
}

module.exports = {
    chat_page, send_message, remove_allchats,Conversation,messages, remove_allconvs
}