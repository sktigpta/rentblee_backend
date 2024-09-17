// server/middleware/business-middleware.js

const businessMiddleware = async (req, res, next) => {
    try {
        const isBusiness = req.user.isBusiness;

        if (!isBusiness) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const businessRegistration = async (req, res, next) => {
    try {
        const isBusiness = req.user.isBusiness;

        if (isBusiness) {
            return res.status(403).json({ message: "You are already registered as business" });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { businessMiddleware, businessRegistration };
