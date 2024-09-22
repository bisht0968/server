const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose")

const employerSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: "Employer"
    },
    employerType: {
        type: String,
        default: "Clerk"
    },
    permissions: [{
        type: String,
    }],
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
    },
    salary: {
        type: Number
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

employerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Employer", employerSchema);