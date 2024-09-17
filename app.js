// Require required packages here
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http'); // Step 1: Require the 'http' module

// Initialisation here
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use("/", express.static('uploads/'));

const corsOptions = {
    origin: ["http://localhost:5173", "http://172.16.17.78:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));

// Require functions from other folders here
const authRouter = require('./auth-router/auth-router');
const adminRoute = require('./auth-router/admin-route');
const connectdb = require('./utils/db');

// Apply middleware
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoute);

const server = http.createServer(app);
const createSocketIoServer = require('./utils/socket');

const io = createSocketIoServer(server);

// Start the server
connectdb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at:${PORT}`);
    });
});
