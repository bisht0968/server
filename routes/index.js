var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render("index", { error: req.flash("error") })
});

module.exports = router;
