const Campground = require('../models/campground')
const { cloudinary } = require('../configs/cloudinary')

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const getAllCampgrounds = async (req, res, next) => {
    try{
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', { campgrounds })
    }catch(e){
        next(e)
    }
}

const getCampground = async (req, res, next) => {
    try{
        const { id } = req.params
        const campground = await Campground.findById(id).populate({ 
            path:'reviews' ,
            populate: {
                path: 'author'
            }
        }).populate('owner')

        if(!campground){
            req.flash('error', 'Campground not found!')
            return res.redirect('/campgrounds')
        }

        res.render('campgrounds/campgroundDetails', { campground })
    }catch(e){
        next(e)
    }
}

const renderNewCampgroundForm = (req, res) => {
    res.render('campgrounds/newCampground')
}

const addCampground = async (req, res, next) => {
    try{
        if (req.files.length > 5) {
            req.flash('error', 'Image limit exceeded! Maximum of 5 images allowed per campground.');
            return res.redirect('/campgrounds/new');
        }

        // geocode the location and set the campground's geometry coordinates
        const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
        const campground = new Campground(req.body.campground)
        campground.geometry = geoData.features[0].geometry

        // map over uploaded files and store each file's Cloudinary URL and filename in campground.images
        campground.images = req.files.map(file => ({ 
            url: file.path, 
            filename: file.filename 
        }))

        campground.owner = req.user._id // when campground is being created, the user automatically becomes the campground owner
        await campground.save()
        console.log(campground)

        req.flash('success', 'Campground created successfully!')
        res.redirect(`/campgrounds/${campground._id}`)
    }catch(e){
        next(e)
    }
}

const renderEditCampgroundForm = async (req, res, next) => {
    try{
        const { id } = req.params
        const campground = await Campground.findById(id)

        if(!campground){
            req.flash('error', 'Campground not found!')
            return res.redirect('/campgrounds')
        }

        res.render('campgrounds/editCampground', { campground })
    }catch(e){
        next(e)
    }
}

const editCampground = async (req, res, next) => {
    try{
        // console.log(req.body)
        const { id } = req.params
        const campground = await Campground.findById(id)

        if(!campground){
            req.flash('error', 'Campground not found!')
            return res.redirect('/campgrounds')
        }

        Object.assign(campground, req.body.campground); // updates campground fields

        // geocode the location and set the campground's geometry coordinates
        const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
        campground.geometry = geoData.features[0].geometry;

        // map over uploaded files and store each file's Cloudinary URL and filename in a new array of images
        const imgs = req.files.map(file => ({ 
            url: file.path, 
            filename: file.filename 
        }))

        if (campground.images.length + imgs.length > 5) {
            req.flash('error', 'Image limit exceeded! Maximum of 5 images allowed per campground');
            return res.redirect(`/campgrounds/${campground._id}/edit`);
        }

        campground.images.push(...imgs) // add new images to existing images in campground
        await campground.save()

        // if there are images to be deleted in campground, remove both from cloudinary and mongodb
        if(req.body.deleteImages){
            // remove images from cloudinary using image filename
            for(let filename of req.body.deleteImages){
                await cloudinary.uploader.destroy(filename)
            }
            // remove images from campground
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
            console.log(campground)
        }

        req.flash('success', 'Campground updated successfully!')
        res.redirect(`/campgrounds/${campground._id}`)
    }catch(e){
        next(e)
    }
}

const deleteCampground = async (req, res, next) => {
    try{
        const { id } = req.params
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'Campground deleted successfully!')
        res.redirect(`/campgrounds`)
    }catch(e){
        next(e)
    }
}

module.exports = { getAllCampgrounds, getCampground,
                   renderNewCampgroundForm, addCampground, 
                   renderEditCampgroundForm, editCampground,
                   deleteCampground }

