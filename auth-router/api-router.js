const express = require('express');
const router = express.Router();
const api = require('../controllers/api-controller');

router.get('/search', api.search);
router.get('/products/:id', api.getProductById);
router.get('/business/:id', api.getBusinessById);
router.get('/category/:id', api.getCategoryById);

module.exports = router;
