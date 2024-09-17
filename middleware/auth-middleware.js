const jwt = require('jsonwebtoken')
const User = require('../modals/user-model')

const authMiddleware = async (req, res, next) => {

    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP or token" });
    }

    const jwtToken = token.replace("Bearer ", "").trim( );


    try {
        const isVeified = jwt.verify(jwtToken, process.env.JWT_SIGNATURE_SECRET_KEY)
        const userData = await User.findOne({ email: isVeified.email }).select({ password: 0 });

        req.user = userData;
        req.token = token;
        req.userId = userData._id;
        
        next();
        
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized or invalid token" });
    }

}

module.exports = authMiddleware;