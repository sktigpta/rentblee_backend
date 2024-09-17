const express = require('express')
const router = express.Router()
const authcontrollers = require("../controllers/auth-controllers")
const ContactForm = require('../controllers/contact-controllers')
const authMiddleware = require("../middleware/auth-middleware")

router.route("/").get(authcontrollers.home)
router.route("/login").post(authcontrollers.login)
router.route("/register").post(authcontrollers.register)
router.route("/user").get(authMiddleware, authcontrollers.user)

module.exports = router;