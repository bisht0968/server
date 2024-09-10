const userModel = require("../models/user");
const accountModel = require("../models/account");
const transactionModel = require("../models/transaction");

const deposit = async function (req, res) {
    try {
        let account = await accountModel.findOne({ accountNumber: req.body.accountNumber });

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }
        if (Number(req.body.amount) < 0) {
            return res.status(400).send({ message: "Wrong amount" });
        }

        account.balance += Number(req.body.amount);

        let userData = await userModel.findOne({ username: req.session.passport.user });

        if (!userData) {
            return res.status(404).send({ message: "User not found" });
        }

        let transaction = await transactionModel.create({
            account: account._id,
            amount: Number(req.body.amount),
            transactionType: "Deposit",
            description: "Deposit Transaction Successfull",
            user: userData._id
        });

        userData.transactions.push(transaction._id);
        account.transactions.push(transaction._id);

        await account.save();
        await userData.save();

        res.status(200).send({ message: "Deposit successful", account });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error Depositing the Money");
    }
};

const withdrawal = async function (req, res) {
    try {
        let account = await accountModel.findOne({ accountNumber: req.body.accountNumber });

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        let userData = await userModel.findOne({ username: req.session.passport.user });

        if (!userData) {
            return res.status(400).send({ message: "User not found" });
        }

        if (account.balance < Number(req.body.amount)) {
            return res.status(400).send({ message: "Insufficient balance" });
        }

        let transaction = await transactionModel.create({
            account: account._id,
            amount: Number(req.body.amount),
            type: "Withdrawal",
            description: "Withdrawal Transaction Successfull",
            user: userData._id
        })

        userData.transactions.push(transaction._id);
        account.transactions.push(transaction._id);

        account.balance -= Number(req.body.amount);

        await userData.save();
        await account.save();

        res.status(200).send({ message: "Withdrawal successful", account });

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error Withdrawing the Money");
    }
};

const transferMoney = async function (req, res) {
    try {
        let sourceAccount = await accountModel.findOne({ accountNumber: req.body.sourceAccountNumber });
        let destinationAccount = await accountModel.findOne({ accountNumber: req.body.destinationAccountNumber });

        let userData = await userModel.findOne({ username: req.session.passport.user });

        if (!sourceAccount || !destinationAccount) {
            return res.status(400).send({ message: "Insufficient balance" });
        }

        if (Number(req.body.amount) < 0 || Number(req.body.amount) > sourceAccount.balance) {
            return res.status(404).send({ message: "Wrong amount" });
        }

        sourceAccount.balance -= Number(req.body.amount);

        let transactionOne = await transactionModel.create({
            account: sourceAccount._id,
            amount: Number(req.body.amount),
            type: "Withdrawal",
            description: "Withdrawal Through Money Transfer Transaction Successfull",
            user: userData._id
        });

        sourceAccount.transactions.push(transactionOne._id);

        let transactionTwo = await transactionModel.create({
            account: destinationAccount._id,
            amount: Number(req.body.amount),
            type: "Deposit",
            description: "Deposited Through Money Transfer Transaction Successfull",
            user: userData._id
        });

        destinationAccount.balance += Number(req.body.amount);

        destinationAccount.transactions.push(transactionTwo._id);

        userData.transactions.push(transactionOne._id);
        userData.transactions.push(transactionTwo._id);

        await sourceAccount.save();
        await destinationAccount.save();
        await userData.save();

        res.status(200).send({ message: "Money Transffered Successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error Transfering the Money");
    }
};

const transactionHistory = async function (req, res) {
    try {
        let account = await accountModel.findOne({ accountNumber: req.params.accountNumber });

        if (!account) {
            return res.status(400).send({ message: "Account Not Found" });
        }

        let transaction = await transactionModel.find({ account: account._id });

        if (!transaction) {
            return res.status(400).send({ message: "Transactions Not Found Or No Transactions" });
        }

        res.send(transaction);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error Fetching the Transaction Details");
    }
};

module.exports = { deposit, withdrawal, transferMoney, transactionHistory };