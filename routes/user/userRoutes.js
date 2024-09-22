var express = require('express');
const { isLoggedIn } = require('../../middlewares/authMiddleware');
var router = express.Router();

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render("profile.ejs");
});

router.get('/adminProfile', isLoggedIn, function (req, res, next) {
  res.render("adminProfile");
})

module.exports = router;
