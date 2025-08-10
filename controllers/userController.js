const User = require('../models/user')

const renderRegistrationForm = (req, res) => {
    res.render('users/register')
}

const register = async (req, res) => {
    try{
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to CampQuest!')
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
}

const renderLoginForm = (req, res) => {
    res.render('users/login')
}

const login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

const logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

module.exports = { renderRegistrationForm, register, renderLoginForm, login, logout }