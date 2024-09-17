const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

// Set up the Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:2005/api/auth/google/callback", // Ensure this URL matches the one in the Google Developer Console
            scope: ['profile', 'email'],
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('Google profile:', profile); // Add this line
            done(null, profile);
        }
    )
);

// Serialize user information into session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user information from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
