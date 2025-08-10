const { reviewSchema } = require('../validationSchemas')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')

// Validate review data in request body using Joi schema
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } 
    next()
}

// Check if user is review author (for authorization)
const isAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Permission denied!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports = { validateReview, isAuthor }