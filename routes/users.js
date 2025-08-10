const express = require('express')
const router = express.Router()
const passport = require('passport')

const { storeReturnTo } = require('../middlewares/userMiddleware')

const { renderRegistrationForm, register, renderLoginForm, login, logout } = require('../controllers/userController')

router.route('/register')
    .get(renderRegistrationForm)
    .post(register)

router.route('/login')
    .get(renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        login)

router.get('/logout', logout)

module.exports = router