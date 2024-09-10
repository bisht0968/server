function isLoggedIn(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/");
    } catch (err) {
        console.log(err.message);
        return res.status(500).redirect('/');
    }
}

module.exports = { isLoggedIn };