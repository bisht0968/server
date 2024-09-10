var express = require('express');
const { isLoggedIn } = require('../../middlewares/authMiddleware');
var router = express.Router();

/* GET users listing. */
router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render("profile.ejs");
});

module.exports = router;
