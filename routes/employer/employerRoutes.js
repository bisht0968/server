const express = require("express");
const router = express();

const { register, login } = require("../../controllers/employerController");

router.post("/register", register);

router.post("/login", login);

module.exports = router;