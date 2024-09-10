const express = require("express");
const router = express();

const { createAccount, getAccount, updateAccount, deleteAccount, allAccounts } = require("../../controllers/accountController");
const { isLoggedIn } = require("../../middlewares/authMiddleware");

router.post("/create", isLoggedIn, createAccount);

router.get("/getaccount/:accountNumber", isLoggedIn, getAccount);

router.post("/update/:accountNumber", isLoggedIn, updateAccount);

router.get("/delete/:accountNumber", isLoggedIn, deleteAccount);

router.get("/accounts", isLoggedIn, allAccounts);

module.exports = router;
