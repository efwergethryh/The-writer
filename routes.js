const express = require('express');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const blogRouter = require('./Routes/blogRoutes');
const userRouter = require('./Routes/userRoutes');
const chatRouter = require('./Routes/chatRoutes');
const apis = require('./Routes/api');

const cors = require('cors');
const { checkUser } = require('./Middleware/AuthMiddleware');
const { connectDatabase } = require('./models/connection');
const Notification = require('./models/Notification');


// Initialize Express app
const app = express();

app.use((req, res, next) => {
    res.setHeader('User-Agent', 'MyApp/1.0 (Node.js/Express)');
    next();
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: 'https://writer.serveo.net',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

// Use CORS middleware
app.use(cors({
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

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


app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/dashboard', checkUser, async (req, res) => {
    try {
        const id = res.locals.user._id
        const notifications = await Notification.find({ userId: id }).exec();
        console.log(notifications);
        res.render('dashboard', { notifications });
    } catch (e) {
        console.log(e);
    }
});

app.use(userRouter);
app.use('/blogs', blogRouter);
app.use(chatRouter);
app.use('/api', apis);
app.use((req, res) => {
    res.status(404).render('404page');
});

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User with ID ${userId} connected`);
    console.log(socket.rooms);
    // console.log(`New client connected ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    socket.on('join', (conv_id) => {


        socket.join(conv_id);
        console.log(`User with ID ${userId} joined`);
    });
    socket.on('message', (data) => {
        const { message, conv_id, receiver_id } = data;
        console.log(`Message from ${socket.id} to ${receiver_id}: ${message}`);
        io.to(conv_id).emit('message', { message: { message, sender: userId, createdAt: new Date() } });
        io.emit('message', { message: { message, sender: userId, createdAt: new Date() } });
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
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
server.listen(PORT, HOST, () => {
    console.log(`Server running on port http://${HOST}:${PORT}/`);
});

module.exports = io;
