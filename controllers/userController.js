
const user = require('../models/User')
const { connection } = require('../models/connection')
const nodemailer = require('nodemailer');
const { google } = require('googleapis')
const Picture = require('../models/picture')
require('../models/auth')
require('dotenv').config();
const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');




function generateVerificationCode() {

    return Math.floor(100000 + Math.random() * 900000).toString();
}

const createToken = (id) => {

    const token = jwt.sign({ userId: id }, 'User', { expiresIn: '1d' })
    return token
}
const get_users = async (req, res) => {
    const id = res.locals.user._id;
    const Users = await user.find({ _id: { $ne: id } }).exec();
    res.send(Users)
}
const verify_code = async (req, res) => {
    try {
        const { code } = req.body;
        console.log(req.body);
        console.log(req.cookies.verificationCode);
        if (req.cookies.verificationCode == code) {

            const { username, password, email, name } = req.cookies.user_input;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new user({
                name: name,
                username: username,
                email: email,
                password: hashedPassword,
                path: '',
                confirmed: true
            });

            await newUser.save();

            const token = createToken(newUser.id);

            res.cookie("jwt", token, { maxAge: 3600000, httpOnly: true, secure: true });
            res.status(200).json({ message: 'Verified' });
        } else {

            res.status(400).json({ message: 'Code incorrect' });
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const verification = (req, res) => {
    res.render('User/verification')
}
const _sendConfirmationEmail = (email, code) => {
    console.log('code sent');
    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
    const REFRESH_TOKEN =process.env.REFRESH_TOKEN
    const oatuth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oatuth.setCredentials({ refresh_token: REFRESH_TOKEN })
    const accessToken = oatuth.getAccessToken()
    const envemail = 'bttt8888444@gmail.com'
    const mailOptions = {
        from: envemail,
        to: email,
        subject: 'Confirmation Code',
        text: `Your confirmation code is: ${code}`
    };


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: envemail,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    });
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: info.response })
        }
    });
};
const login = async (req, res) => {
    const { username, password } = req.body;
    try {

        const _user = await user.findOne({ username });
        if (_user === null) {
            return res.status(401).json({ error: 'User Not found' });
        }
        const passwordMatch = await bcrypt.compare(password, _user.password)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = createToken(_user._id)

        res.cookie(
            "jwt",
            token,
            {
                maxAge: 3600000,
                httpOnly: true
            });


        res.status(201).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.log(error);
    }

}
const register = async (req, res) => {

    try {

        const { email } = req.body;

        const exists = await user.findOne({ email })

        if (exists) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const genCod = generateVerificationCode()
        const R = res.cookie('verificationCode', genCod, { maxAge: 900000, httpOnly: true }, { secure: true });
        console.log(R)
        res.cookie('user_input', req.body, { maxAge: 900000, httpOnly: true }, { secure: true });
        _sendConfirmationEmail(email, genCod);
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error: error });
    }
}
const login_get = (req, res) => {
    res.render('user/login')
}
const register_get = (req, res) => {
    res.render('user/register')
}
const logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out ' })
}
const update_info = async (req, res) => {
    const userId = res.locals.user.id;
    const picture = req.file.filename;

    try {
        if (req.file) {
            const result = await user.findByIdAndUpdate(userId, {
                $set: {
                    path: picture
                }
            }, { new: true })
            console.log(result);
            res.status(200).json({ message: 'updated' })
        } else {
            res.send('not found')
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err })
    }
};
const _delete = async (req, res) => {
    try {
        const userId = req.params.id;
        // Find the user by id and delete it
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const google_register = async (req, res, next) => {

    const options = {
        scope: ['profile', 'email'], // Specify the scopes you want to request
        prompt: 'consent', // Force user consent for previously authorized scopes
        accessType: 'offline' // Request refresh token for offline access  
    }
    console.log(options);
    passport.authenticate('google', options)(req, res, next);

}

module.exports = {
    login,
    register,
    login_get,
    register_get,
    logout,
    update_info,
    _sendConfirmationEmail,
    _delete,
    verification,
    verify_code,
    google_register,
    get_users
}   