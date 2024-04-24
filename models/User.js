


const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        googleId:{
            type:String,
            unique:true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
        ,
        password: {
            type: String,
            required: true,

        },
        confirmed: {
            type:Boolean,
            default:false
        },

        path: {
            type: String,
        },
        confirmationCode:{
            type:Number,
        }


    }
)


const user = mongoose.model('users', userSchema);
module.exports = user;