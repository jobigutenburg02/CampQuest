const Campground = require('../models/campground')
const Review = require('../models/review')

const addReview = async (req, res, next) => {
    try{
        const { id } = req.params
        const campground = await Campground.findById(id)
        const review = new Review(req.body.review)
        review.author = req.user._id // When review is being created, the user automatically becomes the review author
        campground.reviews.push(review)
        await review.save()
        await campground.save()
        req.flash('success', 'Review created!')
        res.redirect(`/campgrounds/${campground._id}`)
    }catch(e){
        next(e)
    }
}

const deleteReview = async(req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports = { addReview, deleteReview }