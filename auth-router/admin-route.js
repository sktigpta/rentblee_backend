const express = require('express');
const AdminRoutes = require('../controllers/admin-controller');
const adminMiddleware = require('../middleware/admin-middleware');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();



router.route('/user').get(authMiddleware, adminMiddleware, AdminRoutes.getAllUsers);


module.exports = router
