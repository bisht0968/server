const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    transactionType: {
        type: String,
        default: "Withdrawal",
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    description: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);