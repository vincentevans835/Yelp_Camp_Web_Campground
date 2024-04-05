const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const campground_controller = require('../controller/campgrounds_controller')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const {upload} = require('../cloudinary/index.js')

router.get('/new', isLoggedIn, campground_controller.new)
router.route('/')
    .get(catchAsync(campground_controller.index))
    .post(isLoggedIn ,upload.array('image'),validateCampground,catchAsync(campground_controller.new_post))

router.route('/:id')
    .get(catchAsync(campground_controller.show_page))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campground_controller.post_update))
    .delete(isLoggedIn, isAuthor, catchAsync(campground_controller.post_delete))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground_controller.post_edit))



module.exports = router