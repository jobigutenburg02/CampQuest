const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session)

const store = new MongoDBStore({
    url: process.env.MONGODB_URI,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 60 * 60 // only update session in DB if it changes or after 24 hours
})

store.on('error', function (e) {
    console.log('Session Store error', e)
})

module.exports = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires 1 week from present time
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}