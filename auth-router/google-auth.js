const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../modals/userModel'); // Import User model

// Route to initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle Google OAuth callback

// Route to handle Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/login/failed' }),
    async (req, res) => {
        try {
            const { emails, displayName, photos } = req.user;
            const email = emails[0].value; // Extract email from user data

            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                // User exists, log them in
                req.login(existingUser, async (err) => {
                    if (err) {
                        console.error('Error logging in user:', err);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }
                    console.log('User logged in:', existingUser);

                    const token = await existingUser.generateToken();
                    return res.redirect(process.env.CLIENT_URL);
                });
            } else {
                // User doesn't exist, create a new user
                const profilePicture = photos[0].value;

                // Set default values for required fields if missing
                const username = email.split('@')[0]; // Use email prefix as username
                const password = Math.random().toString(36).slice(2); // Generate random password
                const phone = ''; // Set default phone value

                // Create new user
                const newUser = await User.create({
                    fullname: displayName,
                    email,
                    profilePicture,
                    username,
                    password,
                    phone,
                    // You can add other fields as needed
                });

                // Log in the newly created user
                req.login(newUser, async (err) => {
                    if (err) {
                        console.error('Error logging in user:', err);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }
                    console.log('New user created and logged in:', newUser);

                    const token = await newUser.generateToken();
                    return res.redirect(process.env.CLIENT_URL);
                });
            }
        } catch (error) {
            console.error('Error handling Google OAuth callback:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);


// Route for login failure
router.get('/login/failed', (req, res) => {
    res.status(401).json({ message: 'Login Failed' });
});

// Route for login success
router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ message: 'Login Successful', user: req.user });
    } else {
        res.status(403).json({ message: 'Not Authenticated' });
    }
});

module.exports = router;
