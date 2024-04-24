const express = require('express')
const Blog = require('../models/blog')

const create = (req, res) => {
    res.render('blogs/create-blog');
}
const add_blogs = async (req, res) => {
    try {
        const blog = new Blog({
            title: req.body.title,
            snippet: req.body.snippet,
            blogbody: req.body.blogbody,
            user_id:req.locals.user.id
        }

        )
        await blog.save().then((result) => {
            res.send(result);
        });
    }
    catch (error) {

        res.status(500).json({ message: 'Internal server error', error: error });
    }
    const get_blog = async (req, res) => {
        Blog.find().then((result) => {
            console.log(result);
            res.render('blogs', { blogs: result });
        });
    }
}
const blog_details = (req,res)=>{
    const id=req.params.id
    Blog.findById(id)
        .then((result)=>{

            res.render('blogs/SingleBlog',{blog:result});

        })
}
const get_blogs = (req,res)=>{
    Blog.find().then((result)=>{
        console.log(result);
        res.render('blogs/blogs',{blogs:result}); 
    });
}
module.exports = {
    create,
    add_blogs,
    blog_details,
    get_blogs
}