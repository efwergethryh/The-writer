const express = require('express');
const passport = require('passport');
const { default: mongoose } = require('mongoose');
const ms = require('mongoose')
const app = express();
const session = require('express-session');
const blogRouter = require('./Routes/blogRoutes')
const userRouter = require('./Routes/userRoutes')

const chatRouter = require('./Routes/chatRoutes')
const { checkUser, isAuthenticated } = require('./Middleware/AuthMiddleware')
const { connectDatabase } = require('./models/connection')
const cookieParser = require('cookie-parser');
// const passport = require('passport');
connectDatabase();  
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('homepage')
});
app.get('/dashboard', isAuthenticated,checkUser, (req, res) => {
    // console.log('in router'+res.locals.user);
    res.render('dashboard')
});
app.use(session({
    secret: 'User',
    resave: false,
    saveUninitialized: false
}));
//User Routes
app.use(userRouter)
//Blog Routes
app.use('/blogs', blogRouter)
app.use(chatRouter);
app.use((req, res) => {
    res.status(404).render('404page')

})
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
app.listen(3000)
module.exports = { connectDatabase };

