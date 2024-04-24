const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        blogbody: {
            type: String,
            required: true
        },
        snippet: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Assuming user_id is an ObjectId
            required: true
        }

    },
    {
        timestamps: true
    }
);
const Blog = mongoose.model('blogs', blogSchema);
module.exports = Blog;