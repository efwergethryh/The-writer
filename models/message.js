
const mongoose = require('mongoose')

const messageionSchema = new mongoose.Schema(
    {
        conversation: { type: mongoose.Schema.Types.ObjectId,
                        ref: 'Conversations'},
        sender: { type: mongoose.Schema.Types.ObjectId,
                  ref: 'users' },
        text: {
            type:String,
            required:true
        },
        
    },
    { timestamps: true }
)


const message = mongoose.model('Messages', messageionSchema);
module.exports = message;