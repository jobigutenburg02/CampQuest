if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const sanitizeV5 = require('./utils/mongoSanitizeV5');
const ExpressError = require('./utils/ExpressError');

const connectDB = require('./configs/database');
const helmetConfig = require('./configs/helmet');
const sessionConfig = require('./configs/session');
const passport = require('./configs/passport');

const allRoutes = require('./routes');

const localsMiddleware = require('./middlewares/localsMiddleware');

connectDB() // connect to database

const app = express()

// configs for extended query parsing & EJS
app.set('query parser', 'extended')
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// middlewares for body parsing and method override
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// middleware for static files
app.use(express.static(path.join(__dirname, 'public')))

// middlewares for sanitization and security
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(helmetConfig);

// middlewares for session management and flash messages
app.use(session(sessionConfig))
app.use(flash())

// middlewares for authentication
app.use(passport.initialize())
app.use(passport.session())

// custom middlewares and routes
app.use(localsMiddleware)
app.use(allRoutes);

// catch all unmatched routes
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// error middleware
app.use((err, req, res, next) => {
    const { status = 500 } = err
    if(!err.message) err.message = 'Internal Server Error'
    res.status(status).render('error', { err })
})

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})