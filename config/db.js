const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb");
        console.log("MongoDB established ")
    } catch (err) {
        console.error(err);
    }
}
module.exports = connectDB;
