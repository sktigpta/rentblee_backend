// Import necessary models
const Business = require('../modals/businessModel');
const Product = require('../modals/productModel');
const Category = require('../modals/categoryModel');

const search = async (req, res) => {
    try {
        const searchTerm = req.query.query; // Get the value of the 'query' parameter

        // Search in businesses
        const businesses = await Business.find({
            $or: [
                { businessname: { $regex: searchTerm, $options: 'i' } }, // Search by business name
                { about: { $regex: searchTerm, $options: 'i' } }, // Search by business about
            ],
        }).select('_id businessname address'); // Select only necessary fields

        // Search in products
        const products = await Product.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, // Search by product name
                { about: { $regex: searchTerm, $options: 'i' } }, // Search by product description
            ],
        }).select('_id name'); // Select only necessary fields

        // Search in categories
        const categories = await Category.find({
            name: { $regex: searchTerm, $options: 'i' }, // Search by category name
        }).select('_id name'); // Select only necessary fields

        // Prepare suggestions array with type
        const suggestions = [
            ...businesses.map(business => ({ type: 'business', ...business.toObject() })),
            ...products.map(product => ({ type: 'product', ...product.toObject() })),
            ...categories.map(category => ({ type: 'category', ...category.toObject() })),
        ];

        res.json({ suggestions }); // Return search results with type
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBusinessById = async (req, res) => {
    try {
        const businessId = req.params.id; // Get the business ID from the request params

        // Find the business by ID in the database
        const business = await Business.findById(businessId);

        // Check if the business exists
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // If the business exists, send it in the response
        res.json(business);
    } catch (error) {
        console.error('Error fetching business:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check for the category in products
        const products = await Product.find({ categories: categoryId }).populate('categories');

        // Check for the category in businesses
        const businesses = await Business.find({ categories: categoryId }).populate('categories');

        res.json({
            category,
            products,
            businesses
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from the request params

        // Find the product by ID in the database
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If the product exists, send it in the response
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { search, getBusinessById, getCategoryById, getProductById };
