const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/bank");
        console.log("MongoDB established ")
    } catch (err) {
        console.error(err);
    }
}
module.exports = connectDB;
