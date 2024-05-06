const message = require('../models/message')
const conversation = require('../models/conversation')
const bcrypt = require('bcrypt')
const user = require('../models/User')
const Notification = require('../models/Notification')
const socketIo = require('socket.io');
const io = require('../models/socket')

const conversations = async (req, res) => {
    try {
        const id = res.locals.user._id

        const conversations = await conversation.find({ 'members': id }).exec()
        const Members = await Promise.all(conversations.map(async c => {
            const sender = await user.findById(c.members[0]);
            const receiver = await user.findById(c.members[1]);
            return [sender, receiver];
        }));
        res.status(200).json({ conversations , Members });
    } catch (error) {
        console.log(error);
    }
}
const chat_page = async (req, res) => {

    try {
        const id = res.locals.user._id
        const conv = await conversation.find({ 'members': id }).exec()
        const Users = await user.find()
        const Members = await Promise.all(conv.map(async c => {
            const sender = await user.findById(c.members[0]);
            const receiver = await user.findById(c.members[1]);
            return [sender, receiver];
        }));

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
const clear_chat = async (req, res) => {
    try {
        const id = req.params.conv_id
        message.deleteMany({ conversation: id });

        res.status(200).json({ message: 'chat cleared' })
    } catch (error) {
        res.status(400).json({ message: 'An error Happened' })
    }

}
const delete_single_conversation = async (req, res) => {
    try {
        const id = req.params.id
        message.deleteMany({ conversation: id });

        await conversation.findByIdAndDelete({ _id: id });

        res.status(200).json({ message: 'Conversation deleted' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}
const new_notification = (req, res) => {
    try {
        
        const id = res.locals.user._id

        const notification = new Notification({
            message: req.body.message,
            read: false,
            userId: id
        })
        notification.save()
        res.status(200).json({ message: 'Notification saved' })
    } catch (err) {
        res.status(400).json({ message: `Error +${err}` })

    }
}
const Conversation = async (req, res) => {


    try {
        const id = req.params.id;
        const _conversation = await conversation.findById({ _id: id })
        const User = await user.findById({ _id: _conversation.members[1] })
        res.status(200).json({ _conversation, User });
    } catch (error) {
        res.status(400).json('Error!' + error)
    }
}
const messages = async (req, res) => {
    const id = req.params.id;

    try {
        const Messages = await message.find({ conversation: id }).exec()

        res.status(200).json({ Messages });
    } catch (error) {
        res.status(400).json(`error +${error}`)
    }
}
const send_message = async (req, res) => {
    try {
        const existConversation = await conversation.findById(req.body.conversation_id);
        const sender_id = res.locals.user._id;
        const receiver_id = req.body.receiver_id;

        if (existConversation) {
            const newMessage = new message({
                conversation: existConversation._id,
                sender: sender_id,
                text: req.body.text
            });
            await newMessage.save();
            res.status(200).json({message:newMessage , m:'sent successfully'});
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

            io.emit('message', { message: req.body.text });

            res.status(200).json('sent successfully');
        }
    } catch (error) {
        res.status(400).json('Error!' + error)
    }
}

module.exports = {
    chat_page,
    send_message,
    remove_allchats,
    Conversation,
    messages,
    remove_allconvs,
    clear_chat,
    new_notification,
    conversations,
    delete_single_conversation
}