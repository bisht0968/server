const adminModel = require("../models/admin");
const userModel = require("../models/user");
const accountModel = require("../models/account");
const transactionModel = require("../models/transaction");
const employerModel = require("../models/employer");

const passport = require("passport");

const register = function (req, res) {
    try {
        const admin = new adminModel({
            username: req.body.username,
            role: "Admin",
            email: req.body.email,
            fullname: req.body.fullname,
            phonenumber: req.body.phonenumber,
            adminType: req.body.adminType,
            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                pinCode: req.body.pinCode,
            },
            dateOfBirth: req.body.dateOfBirth
        });

        adminModel.register(admin, req.body.password).then(function () {
            passport.authenticate("admin-local")(req, res, async function () {

                switch (req.body.adminType) {
                    case "Manager":
                        admin.permissions = ["ManageUsers", "ViewReports", "ApproveLoans"];
                        break;
                    case "SuperAdmin":
                        admin.permissions = ["ManageUsers", "ViewReports", "ApproveLoans", "ManageTransactions", "ManageAdmins"];
                        break;
                    case "Auditor":
                        admin.permissions = ["ViewReports", "AuditLogs"];
                        break;
                    default:
                        admin.permissions = ["BasicAdminAccess"];
                        break;
                }

                await admin.save();

                await admin.save();
                res.redirect("/user/adminProfile");
            })
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("There is a problem in Server");
    }
};

const signup = function (req, res) {
    res.render("adminlogin", { error: req.flash('error') });
}

const login = function (req, res) {
    try {
        passport.authenticate("admin-local", {
            failureFlash: true,
            successRedirect: "/user/adminProfile",
            failureRedirect: "/admin/signup"
        })(req, res);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

const dashboard = async function (req, res) {
    try {
        let users = await userModel.countDocuments();
        let accounts = await accountModel.countDocuments();
        let transactions = await transactionModel.countDocuments();
        let recentActivity = await transactionModel.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            users,
            accounts,
            transactions,
            recentActivity
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const getAllUsers = async function (req, res) {
    try {
        const allUsers = await userModel.find();

        if (!allUsers.length) return res.status(404).send({ message: "No Accounts" });
        res.send(allUsers);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const getUser = async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).send({ message: "Account not found" });
        }
        res.send(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const deleteUser = async function (req, res) {
    try {
        await userModel.deleteOne({ email: req.params.email });

        res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const getAllEmployers = async function (req, res) {
    try {
        let allEmolyers = await employerModel.find();

        if (!allEmolyers.length) return res.send("No Employer is Found");
        res.send(allEmolyers);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const getEmployer = async function (req, res) {
    try {
        let employer = await employerModel.findOne({ username: req.params.username });

        if (!employer) return res.status(404).send("Employer Not Found");
        res.send(employer);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const updateEmployer = async function (req, res) {
    try {
        let employer = await employerModel.findOne({ username: req.params.username });

        if (!employer) return res.status(404).send("No Employer Found");

        if (req.body.fullname) employer.fullname = req.body.fullname;
        if (req.body.role) employer.role = req.body.role;
        if (req.body.salary) employer.salary = req.body.salary;
        if (req.body.permissions) employer.permissions.push(req.body.permissions);
        if (req.body.employerType) employer.employerType = req.body.employerType;
        if (req.body.activeStatus) employer.activeStatus = req.body.activeStatus;
        if (req.body.phoneNumber) employer.phoneNumber = req.body.phoneNumber;
        if (req.body.address) {
            employer.street = req.body.street;
            employer.city = req.body.city;
            employer.state = req.body.state;
            employer.pinCode = req.body.pinCode;
        }

        await employer.save();
        res.send(employer);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
};

const toggleEmployerStatus = async function (req, res) {
    try {
        let employer = await employerModel.findOne({ username: req.params.username });

        if (!employer) return res.status(404).send("Employer Not Found");

        employer.activeStatus = !employer.activeStatus;
        await employer.save();
        res.send(employer);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const deleteEmployer = async function (req, res) {
    try {
        await employerModel.deleteOne({ username: req.params.username });

        res.status(200).send({ message: "Employer deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const updateSalary = async function (req, res) {
    try {
        let employer = await employerModel.findOne({ username: req.params.username });

        if (!employer) return res.status(404).send("Employer Not Found");

        if (req.body.updateValue === "Increment") employer.salary += req.body.amount;
        else if (req.body.updateValue === "Decrement") {
            if (employer.salary - req.body.amount >= 0) employer.salary -= req.body.amount;
            else {
                res.status(400).send("Insufficient Balance");
            }
        }

        await employer.save();

        res.send(employer);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { register, signup, login, dashboard, getAllUsers, getUser, deleteUser, getAllEmployers, getEmployer, updateEmployer, toggleEmployerStatus, deleteEmployer, updateSalary };