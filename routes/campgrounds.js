const express = require('express')
const router = express.Router()

const { isLoggedIn } = require('../middlewares/userMiddleware')
const { validateCampground, isOwner } = require('../middlewares/campgroundMiddleware')

const { editCampground, getAllCampgrounds, renderNewCampgroundForm, 
    addCampground, getCampground, renderEditCampgroundForm, 
    deleteCampground } = require('../controllers/campgroundController')

const multer = require('multer')
const { storage } = require('../configs/cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(getAllCampgrounds)
    .post(isLoggedIn, upload.array('image'), validateCampground, addCampground)

router.get('/new', isLoggedIn, renderNewCampgroundForm)

router.route('/:id')
    .get(getCampground)
    .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, editCampground)
    .delete(isLoggedIn, isOwner, deleteCampground)

router.get('/:id/edit', isLoggedIn, isOwner, renderEditCampgroundForm)

module.exports = router