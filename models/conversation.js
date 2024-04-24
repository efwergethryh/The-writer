
const mongoose = require('mongoose');
const message = require('./message');

const conversationSchema = new mongoose.Schema(
    {
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }, { type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        messages: { type: mongoose.Schema.Types.ObjectId, ref: 'Messages' }

    }
)

conversationSchema.pre('remove', async function (next) {
    try {
        await message.deleteMany({ conversation: this._id });
        next();
    } catch (error) {
        next(error);
    }
});
const conversation = mongoose.model('conversations', conversationSchema);

module.exports = conversation;