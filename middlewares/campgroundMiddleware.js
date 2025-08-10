const { campgroundSchema } = require('../validationSchemas')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')

// Validate campground data in request body using Joi schema
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Check if user is campground owner (for authorization)
const isOwner = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground.owner.equals(req.user._id)){
        req.flash('error', 'Permission denied!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports = { validateCampground, isOwner }