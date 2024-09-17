const User = require('../modals/user-model')
const bcrypt = require('bcrypt')
const fs = require('fs');


const Post = require("../modals/post-model")
const Notification = require("../modals/notification");
const Seen = require("../modals/seen");



//Initialising value

const home = async (req, res) => {
    res.send("This is Home")
}

//Registration API

const register = async (req, res) => {
    try {
        const { fullname, username, email, phone, password } = req.body;

        // Check if email and username already exist
        const emailExist = await User.findOne({ email });
        const usernameExist = await User.findOne({ username });

        if (emailExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (usernameExist) {
            return res.status(400).json({ message: "Username not available" });
        }

        // Create user
        const userCreated = await User.create({
            fullname,
            username,
            email,
            phone,
            password,
        });

        // Return success response
        return res.status(201).json({
            message: "Registration successful",
            token: await userCreated.genetateToken(),
            userID: userCreated._id.toString()
        });

    } catch (error) {
        // Internal server error
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



//Login API
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email })

        if (!userExist) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = await bcrypt.compare(password, userExist.password);

        if (user) {
            return res.status(200).json({
                message: "Login successful",
                token: await userExist.genetateToken(),
                userID: userExist._id.toString()
            });
        } else {
            // Incorrect password
            return res.status(401).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        // Internal server error
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// user

const user = async (req, res) => {

    try {
        const userData = req.user;
        return res.status(200).json({ userData })
    } catch (error) {
        console.log(error);
    }
}




module.exports = { home, login, register, user, };