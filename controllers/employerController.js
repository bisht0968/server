const passport = require("passport");
const employerModel = require("../models/employer");

const register = function (req, res) {
    try {
        let employer = new employerModel({
            username: req.body.username,
            email: req.body.email,
            fullname: req.body.fullname,
            address: {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                pinCode: req.body.pinCode
            },
            phoneNumber: req.body.phoneNumber,
            dob: req.body.dob,
        });

        employerModel.register(employer, req.body.password).then(function () {
            passport.authenticate("employer-local")(req, res, function () {
                res.send(employer);
            })
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};

const login = function (req, res) {
    try {
        passport.authenticate("employer-local", {
            successRedirect: "/user/employerProfile",
            failureFlash: true,
            failureRedirect: "/"
        })(req, res);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
};


module.exports = { register, login };