const express = require("express");
const router = express();

const { isLoggedIn } = require("../../middlewares/authMiddleware");

const { register, signup, login, dashboard, getAllUsers, getUser, deleteUser, getAllEmployers, getEmployer, deleteEmployer, updateEmployer, updateSalary, toggleEmployerStatus } = require("../../controllers/adminController");

router.post("/register", register);

router.post("/login", login, function (req, res) { });

router.get("/dashboard", isLoggedIn, dashboard);

router.get("/allusers", isLoggedIn, getAllUsers);

router.get("/user/:email", isLoggedIn, getUser);

router.get("/deleteUser/:email", isLoggedIn, deleteUser);

router.get("/signup", signup);

router.get("/allemployers", isLoggedIn, getAllEmployers);

router.get("/employer/:username", isLoggedIn, getEmployer);

router.get("/deleteEmployer/:username", isLoggedIn, deleteEmployer);

router.post("/updateEmployer/:username", isLoggedIn, updateEmployer);

router.post("/toggleEmployerStatus/:username", isLoggedIn, toggleEmployerStatus);

router.post("/updateSalary/:username", isLoggedIn, updateSalary);

module.exports = router; 