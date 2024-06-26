const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken:mapBoxToken})

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.new = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.new_post = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.author = req.user._id
    await campground.save()
    console.log(campground)
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.show_page = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}
module.exports.post_edit = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}
module.exports.post_update = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.image.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.post_delete = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`)
}

