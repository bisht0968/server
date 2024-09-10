const express = require("express");
const router = express.Router();

const { register, login, logout, details, isLoggedIn } = require("../../controllers/authController");

router.post("/register", register);

router.post("/login", login, function (req, res) { })

router.get("/logout", logout);

router.get("/me", isLoggedIn, details);

module.exports = router;