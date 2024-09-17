const express = require('express');
const router = express.Router();
const authcontrollers = require("../controllers/auth-controllers");
const authMiddleware = require("../middleware/auth-middleware");

router.route("/login").post(authcontrollers.login);
router.route("/register").post(authcontrollers.register);
router.route("/user").get(authMiddleware, authcontrollers.user);
router.route("/updateUser").post(authcontrollers.updateUser);
router.route("/uploadProfilePicture").post(authcontrollers.uploadProfilePicture);


module.exports = router;