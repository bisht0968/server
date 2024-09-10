var express = require('express');
var router = express.Router();

const authRoutes = require("../routes/auth/authRoutes");

const { isLoggedIn } = require("../controllers/authController");

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  // res.send('Hello World!');
  res.render("index", { error: req.flash("error") })
});
// router.get('/profile', isLoggedIn, function (req, res, next) {
//   // res.render('index', { title: 'Express' });
//   // res.send('Hello World!');
//   res.render("profile");
// });

router.use("/auth", authRoutes);

module.exports = router;
