// Check if user is authenticated
const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please sign in')
        return res.redirect('/login')
    }
    next()
}

// Store the original URL to redirect user back after login
const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports = { isLoggedIn, storeReturnTo }