const passport = require("passport");
const localStrategy = require("passport-local");

const { isLoggedIn } = require("../middlewares/authMiddleware");

const userModel = require("../models/user");

passport.use(new localStrategy(userModel.authenticate()));


const register = function (req, res) {
    try {
        let userData = new userModel({
            username: req.body.username,
            role: req.body.role,
            fullname: req.body.fullname,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                postalCode: req.body.postalCode
            },
            dateOfBirth: req.body.dateOfBirth
        });

        userModel.register(userData, req.body.password).then(function () {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/user/profile")
            })
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error Registering new user")
    }
};

const login = passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/",
    failureFlash: true
});

const logout = function (req, res, next) {
    try {

        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error Logout")
    }
}

const details = async function (req, res) {
    try {
        const user = await userModel.findOne({
            username: req.session.passport.user
        });
        res.send(user);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error Fetching the User details")
    }
}

module.exports = { register, login, isLoggedIn, logout, details };