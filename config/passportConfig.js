const passport = require("passport");
const localStrategy = require("passport-local");

const userModel = require("../models/user");
const adminModel = require("../models/admin");
const employerModel = require("../models/employer");

passport.use("user-local", new localStrategy(userModel.authenticate()));
passport.use("admin-local", new localStrategy(adminModel.authenticate()));
passport.use("employer-local", new localStrategy(employerModel.authenticate()));

passport.serializeUser(function (user, done) {
    done(null, { id: user.id, role: user.role });
})

passport.deserializeUser(async function (obj, done) {
    try {
        if (obj.role === "Admin") {
            const admin = await adminModel.findById(obj.id);
            done(null, admin);
        } else if (obj.role === "Employer") {
            const employer = await employerModel.findById(obj.id);
            done(null, employer);
        }
        else {
            const user = await userModel.findById(obj.id);
            done(null, user);
        }
    } catch (err) {
        done(err, null);
    }
});
