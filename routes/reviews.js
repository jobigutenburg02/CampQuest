const express = require('express')
const router = express.Router({ mergeParams: true })

const { validateReview, isAuthor } = require('../middlewares/reviewMiddleware')
const { isLoggedIn } = require('../middlewares/userMiddleware')

const { addReview, deleteReview } = require('../controllers/reviewController')

router.post('/', isLoggedIn, validateReview, addReview)
router.delete('/:reviewId', isLoggedIn, isAuthor, deleteReview)

module.exports = router