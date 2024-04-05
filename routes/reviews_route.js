const express = require('express')
const router = express.Router({mergeParams:true})
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const review_controller = require('../controller/review_controller')


const catchAsync = require('../utils/catchAsync')



router.post('/',isLoggedIn,validateReview, catchAsync(review_controller.post_review))
router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(review_controller.delete_review))

module.exports = router