const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
const { isAuthenticated } = require('../Middleware/AuthMiddleware')
const blogController = require('../controllers/blogController')

router.post('/add-blogs', isAuthenticated, blogController.add_blogs);
router.get('/create', isAuthenticated, blogController.create);
router.get('/', blogController.get_blogs)
router.get('/:id', isAuthenticated, blogController.blog_details)

module.exports = router

//,AuthMiddleware.isAuthenticated