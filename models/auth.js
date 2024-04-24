const passport = require('passport');
const user = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const createToken = (id) => {

    const token = jwt.sign({ userId: id }, 'User', { expiresIn: '1h' })
    return token
}
require('dotenv').config();
var GoogleStrategy = require('passport-google-oauth2').Strategy;
function generateUserName(email) {
    // Extract the part of the email address before the @ symbol
    const username = email.split('@')[0];

    // You may want to further process the username, such as removing special characters or spaces
    // For simplicity, we'll return the username as is
    return username;
}

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true,
    scope: ['profile', 'email'] // Add the required scope parameter
}, async (req, accessToken, refreshToken, profile, done) => {
    const { sub, name, email, picture } = profile._json;
    const res = req.res; // Get the response object from the request object

    try {
        // Check if the user already exists in your database
        const existingUser = await user.findOne({ googleId: sub });

        if (existingUser) {

            const token = createToken(existingUser._id)
            res.cookie("jwt", token, { maxAge: 3600000, httpOnly: true, secure: true });

            done(null, existingUser);
        } else {
            const hashedPassword = await bcrypt.hash('123', 10);
            // If the user doesn't exist, you can choose to create a new user
            const newUser = new user({
                name: name,
                password: hashedPassword, // You may handle password differently, depending on your application logic
                email: email,
                path: picture,
                username: generateUserName(email),
                googleId: sub
            });
            await newUser.save();

            // Redirect to the dashboard
            res.redirect('/dashboard');
            return done(null, newUser);

        }

    } catch (error) {
        return done(error, null);
    }
}));