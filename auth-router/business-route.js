const express = require('express');
const router = express.Router();
const businessControllers = require("../controllers/business-controller");
const { businessMiddleware, businessRegistration } = require("../middleware/business-middleware");
const authMiddleware = require('../middleware/auth-middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    
    filename: (req, file, cb) => {
        // Generate a random 20-digit string
        const randomString = Math.random().toString(36).substring(2, 22);
        // Get the file extension
        const ext = path.extname(file.originalname);
        // Concatenate random string with extension
        cb(null, randomString + ext);
    }
});

const upload = multer({ storage });

// Route Definitions
router.post('/register', authMiddleware, businessRegistration, upload.single('logo'), businessControllers.register);
router.get('/business', authMiddleware, businessControllers.getBusinessDetails);
router.get('/:businessId/products', businessControllers.productList);
router.post('/:businessId/add-product', authMiddleware, businessMiddleware, upload.single('productImage'), businessControllers.addProduct);
router.delete('/:businessId/delete-product/:productId', authMiddleware, businessMiddleware, businessControllers.deleteProduct);
router.put('/:businessId/edit-product/:productId', authMiddleware, businessMiddleware, upload.single('productImage'), businessControllers.editProduct);
router.post('/:businessId/send-message', authMiddleware, businessControllers.sendMessage);

module.exports = router;
