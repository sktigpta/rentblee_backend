const jwt = require('jsonwebtoken');
const User = require('../modals/userModel'); // Correct the path if needed

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const jwtToken = token.replace("Bearer ", "").trim();

    try {
        const verified = jwt.verify(jwtToken, process.env.JWT_SIGNATURE_SECRET_KEY);
        const user = await User.findOne({ email: verified.email }).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        req.token = jwtToken;
        req.userId = user._id;

        console.log("req.user:", user); // Log user object

        next();

    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;