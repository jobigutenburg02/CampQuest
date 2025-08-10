const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const campgroundRoutes = require('./campgrounds');
const reviewRoutes = require('./reviews');

router.get('/', (req, res) => {
    res.render('home');
});

router.use('/', userRoutes);
router.use('/campgrounds', campgroundRoutes);
router.use('/campgrounds/:id/reviews', reviewRoutes);

module.exports = router;
