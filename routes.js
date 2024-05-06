const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');
const ioSocket = require('socket.io');
const cookieParser = require('cookie-parser');
const blogRouter = require('./Routes/blogRoutes');
const userRouter = require('./Routes/userRoutes');
const chatRouter =  require('./Routes/chatRoutes');
const { checkUser, isAuthenticated } = require('./Middleware/AuthMiddleware');
const { connectDatabase } = require('./models/connection');
const Notification = require('./models/Notification');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = ioSocket(server);

// Connect to database
connectDatabase();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: 'User',
    resave: false,
    saveUninitialized: false
}));

// Routes
app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/dashboard', checkUser, async(req, res) => {
    const id = res.locals.user._id
    const notifications =await Notification.find({userId:id}).exec();
    console.log(notifications);
    res.render('dashboard',{notifications});
});

app.use(userRouter);
app.use('/blogs', blogRouter);
app.use(chatRouter);

app.use((req, res) => {
    res.status(404).render('404page');
});

// Socket.IO connection

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    }); 

    socket.on('message', (data) => {
        
        io.emit('message',{message:data.message})
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    // Error handling for listening to 'message' event
    socket.on('error', (error) => {
        console.error('Error receiving message:', error);
    });
});


// Serialize and deserialize user for authentication
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = io;
