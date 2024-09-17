require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const session = require('express-session'); // Change this line
const passport = require('passport');
const passportSetup = require('./utils/passport'); // Ensure passport setup is imported

const app = express();

// Initialisation here
const PORT = process.env.PORT || 2005; // Ensure there is a default port

// Middleware
app.use(express.json());
app.use("/", express.static('uploads/'));

app.use(
    session({
        secret: "rentblee", // Secret key for signing the session ID cookie
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
    })
);

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: ["http://localhost:5173", "http://172.16.17.78:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));

// Require functions from other folders here
const authRouter = require('./auth-router/auth-router');
const google = require('./auth-router/google-auth');
const businessRoute = require('./auth-router/business-route');
const apiRoute = require('./auth-router/api-router');
const connectdb = require('./utils/db');

// Apply middleware
app.use("/api/auth", authRouter);
app.use("/api/auth", google);
app.use("/api/business", businessRoute);
app.use("/api", apiRoute);

const server = http.createServer(app);
const createSocketIoServer = require('./utils/socket');
const io = createSocketIoServer(server);

// Start the server
connectdb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at:${PORT}`);
    });
});
