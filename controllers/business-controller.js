const Business = require('../modals/businessModel');
const Product = require('../modals/productModel');
const Category = require('../modals/categoryModel');
const User = require('../modals/userModel');
const fs = require('fs');

const getBusinessDetails = async (req, res) => {
    try {
        const userId = req.userId;

        const business = await Business.findOne({ userId })
            .populate('userId', 'username fullname email phone profilePicture')
            .populate({
                path: 'categories',
                select: 'name -_id' // Exclude _id from the populated categories
            });

        if (!business) {
            return res.status(400).json({ message: "Business not found" });
        }

        return res.status(200).json({ business });
    } catch (error) {
        console.error("Error fetching business:", error.message, error.stack);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const register = async (req, res) => {
    try {
        const { businessname, about, address, phone, email, categories } = req.body;
        const userId = req.userId;
        const logoUrl = req.file ? req.file.path : null; // Assuming multer adds 'path' to 'file' object

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if categories is provided and is an array
        if (!Array.isArray(categories)) {
            return res.status(400).json({ message: "Categories should be an array" });
        }

        const businessExist = await Business.findOne({ businessname });
        if (businessExist) {
            return res.status(400).json({ message: "Business name already exists" });
        }

        const newBusiness = await Business.create({
            userId,
            businessname,
            phone,
            email,
            about,
            address,
            categories,
            logo: logoUrl // Include the logo URL in the business document
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBusiness = true;
        await user.save();

        return res.status(201).json({ message: "Business registered successfully", business: newBusiness });
    } catch (error) {
        console.error("Error registering business:", error.message, error.stack);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const addProduct = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { name, description, pricePerDay, pricePerWeek, pricePerMonth } = req.body;
        
        // Handle uploaded product image
        const productImage = req.file ? `/products/${req.file.filename}` : null;

        // Parse categories from request body
        const categories = JSON.parse(req.body.categories);
        const categoriesArray = Array.isArray(categories) ? categories : [categories];

        // Find existing categories in the database
        const existingCategories = await Category.find({ name: { $in: categoriesArray } });

        // Extract existing category names
        const existingCategoryNames = existingCategories.map(category => category.name);

        // Identify missing categories
        const missingCategories = categoriesArray.filter(category => !existingCategoryNames.includes(category));

        // Create missing categories
        for (const categoryName of missingCategories) {
            const newCategory = await Category.create({ name: categoryName });
            existingCategories.push(newCategory);
        }

        // Extract category IDs
        const categoryIds = existingCategories.map(category => category._id);

        // Create the product
        const newProduct = await Product.create({
            businessId,
            name,
            description,
            pricePerDay,
            pricePerWeek,
            pricePerMonth,
            categories: categoryIds,
            productImage // Save the image URL in the product document
        });

        return res.status(201).json({ message: 'Product uploaded successfully', product: newProduct });
    } catch (error) {
        console.error('Error uploading product:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const productList = async (req, res) => {
    try {
        const { businessId } = req.params;

        // Populate the 'categories' field to include category data
        const products = await Product.find({ businessId }).populate('categories');

        // Format the products array
        const formattedProducts = products.map(product => ({
            ...product.toObject(),
            categories: product.categories.map(category => ({
                name: category.name
            }))
        }));

        return res.status(200).json({ products: formattedProducts });
    } catch (error) {
        console.error("Error listing products:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { businessId, productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.businessId.toString() !== businessId) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        await product.remove();

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const editProduct = async (req, res) => {
    try {
        const { businessId, productId } = req.params;
        const { name, description, pricePerDay, pricePerWeek, pricePerMonth, categories } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Assuming multer adds 'path' to 'file' object

        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.businessId.toString() !== businessId) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Find existing categories in the database
        const existingCategories = await Category.find({ name: { $in: categories } });
        const existingCategoryNames = existingCategories.map(category => category.name);

        // Identify missing categories
        const missingCategories = categories.filter(category => !existingCategoryNames.includes(category));

        // Create missing categories
        for (const categoryName of missingCategories) {
            const newCategory = await Category.create({ name: categoryName });
            existingCategories.push(newCategory);
        }

        // Extract category IDs
        const categoryIds = existingCategories.map(category => category._id);

        // Update product details
        product.name = name;
        product.description = description;
        product.pricePerDay = pricePerDay;
        product.pricePerWeek = pricePerWeek;
        product.pricePerMonth = pricePerMonth;
        product.categories = categoryIds;

        // Update image URL if a new image was uploaded
        if (imageUrl) {
            product.imageUrl = imageUrl;
        }

        await product.save();

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error editing product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const sendMessage = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { message } = req.body;

        // Process the message logic here
        // For demonstration, returning success response
        return res.status(200).json({ message: "Message sent successfully", businessId, message });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, addProduct, productList, deleteProduct, editProduct, getBusinessDetails, sendMessage };
