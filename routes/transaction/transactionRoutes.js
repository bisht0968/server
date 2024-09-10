const express = require("express");
const router = express();

const { deposit, withdrawal, transferMoney, transactionHistory } = require("../../controllers/transactionController");
const { isLoggedIn } = require("../../middlewares/authMiddleware")

router.post("/deposit", isLoggedIn, deposit);

router.post("/withdrawal", isLoggedIn, withdrawal);

router.post("/transfer", isLoggedIn, transferMoney);

router.get("/alltransactions/:accountNumber", isLoggedIn, transactionHistory);

module.exports = router;