const express = require("express");
const router = express();

const accountModel = require("../models/account");
const userModel = require("../models/user");
const transactionModel = require("../models/transaction");

const createAccount = async function (req, res) {
    try {

        let userData = await userModel.findOne({ username: req.session.passport.user });

        if (!userData) {
            return res.status(400).json({ message: "User not found" });
        }

        let account = await accountModel.create({
            accountNumber: req.body.accountNumber,
            accountType: req.body.accountType,
            balance: req.body.balance,
            user: userData._id
        });

        userData.accounts.push(account._id);

        await userData.save();
        res.status(201).send({ message: "Account created successfully", account });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating account");
    }
};

const getAccount = async function (req, res) {
    try {
        const account = await accountModel.findOne({ accountNumber: req.params.accountNumber }).populate("user").populate("transactions");

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        res.status(201).send({ message: "Account Details: ", account });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error Fetching the Account details")
    }
};

const updateAccount = async function (req, res) {
    try {
        let account = await accountModel.findOne({ accountNumber: req.params.accountNumber });

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        account.accountType = req.body.accountType || account.accountType;

        await account.save();
        res.status(200).send({ message: "Account updated successfully", account });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error Updating the Account");
    }
};

const deleteAccount = async function (req, res) {
    try {
        let account = await accountModel.findOne({ accountNumber: req.params.accountNumber });

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        let user = await userModel.findOne({ _id: account.user });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.accounts.pull(account._id);

        await user.save();

        await accountModel.deleteOne({ _id: account._id });

        res.status(200).send({ message: "Account deleted successfully" });


    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error Deleting the Account");
    }
};

const allAccounts = async function (req, res) {
    try {

        let userData = await userModel.findOne({ username: req.session.passport.user });

        if (!userData) {
            return res.status(401).send({ message: "User Not Found" });
        }

        let accountsData = await accountModel.find({ user: userData._id });

        if (!accountsData) {
            return res.status(404).send({ message: "No accounts found" });
        }

        res.send(accountsData);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error fetching all accounts");
    }
};

module.exports = { createAccount, getAccount, updateAccount, deleteAccount, allAccounts };