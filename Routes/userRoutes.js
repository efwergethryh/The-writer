const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { checkUser } = require('../Middleware/AuthMiddleware');
const passport = require('passport');
require('dotenv').config();
const storage = multer.diskStorage({
    // Define where to store the uploaded files
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Save files to the 'uploads' directory
    },
    // Define how to name the uploaded files
    filename: function (req, file, cb) {
        // Use the original file name with a timestamp prefix to ensure uniqueness
        const timestamp = Date.now(); // Get the current timestamp
        const filename = `${timestamp}-${file.originalname}`; // Prefix with timestamp
        cb(null, filename); // Callback with the generated filename
    }
});
const upload = multer({
    storage: storage,
});
// router.use(bodyParser.json())
router.use(express.json({ limit: '50mb' }))
router.use(cookieParser())
router.get('/auth/google/callback', passport.authenticate("google", {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

router.get('/register', userController.register_get)
router.get('/login', userController.login_get)
router.get('/verify_email', userController.verification)
router.get('/logout', checkUser, userController.logout)
router.get('/auth/google', userController.google_register);
router.get('/api/users',userController.get_users);
router.put('/update-info', checkUser, upload.single('picture'), userController.update_info);
router.post('/api/verify_code', userController.verify_code);
router.post('/sendEmail', userController._sendConfirmationEmail);
router.post('/api/login', userController.login)

router.post('/api/register', userController.register)

router.delete('/deleteuser/:id', userController._delete)
module.exports = router