// Require required pacages here
const mongoose = require('mongoose')

//url for mongodb database

const URI = process.env.MDB_URI

//Building connection to the mongoDB database

const connectdb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connection sucessful from the database");
    } catch (error) {
        console.log("Database connection failed");
        process.exit(0);
    }


}

module.exports = connectdb;