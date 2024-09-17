const User = require('../modals/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

// Registration API
const register = async (req, res) => {
    try {
        const { fullname, username, email, phone, password } = req.body;

        const emailExist = await User.findOne({ email });
        const usernameExist = await User.findOne({ username });

        if (emailExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (usernameExist) {
            return res.status(400).json({ message: "Username not available" });
        }

        const userCreated = await User.create({
            fullname,
            username,
            email,
            phone,
            password,
        });

        return res.status(201).json({
            message: "Registration successful",
            token: await userCreated.generateToken(),
            userID: userCreated._id.toString()
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login API
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = await bcrypt.compare(password, userExist.password);

        if (user) {
            return res.status(200).json({
                message: "Login successful",
                token: await userExist.generateToken(),
                userID: userExist._id.toString()
            });
        } else {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// User API
const user = async (req, res) => {
    try {
        const userData = req.user;
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Update User API
const updateUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { email, phone, location } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email && email !== user.email) {
            const existingUserWithEmail = await User.findOne({ email });
            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already in use by another user' });
            }
            user.email = email;
        }

        if (phone && phone !== user.phone) {
            const existingUserWithPhone = await User.findOne({ phone });
            if (existingUserWithPhone && existingUserWithPhone._id.toString() !== userId) {
                return res.status(400).json({ message: 'Phone number is already in use by another user' });
            }
            user.phone = phone;
        }

        if (location) {
            user.location = location;
        }

        await user.save();

        return res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Upload Profile Picture API
const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { email } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email && email !== user.email) {
            const existingUserWithEmail = await User.findOne({ email });
            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already in use by another user' });
            }
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePicture = req.file.filename.replace(/\s+/g, '-');

        // Delete old profile picture if it exists
        if (user.profilePicture) {
            const oldProfilePicturePath = `C:\\Users\\Shaktidhar gupta\\OneDrive\\Desktop\\4th-Sem\\server\\uploads\\ProfilePictures\\${user.profilePicture}`;

            if (fs.existsSync(oldProfilePicturePath)) {
                fs.unlinkSync(oldProfilePicturePath);
            }
        }

        user.profilePicture = profilePicture;
        await user.save();

        return res.status(201).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ error: 'Failed to upload profile picture' });
    }
};


module.exports = { register, login, user, updateUser, uploadProfilePicture };
