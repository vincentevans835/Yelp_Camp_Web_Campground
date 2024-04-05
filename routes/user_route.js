const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const user_controller = require('../controller/user_controller')

router.route('/register')
    .get(user_controller.register)
    .post(catchAsync(user_controller.post_user))
router.route('/login')
    .get(user_controller.login_user)
    .post(storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        user_controller.post_login)

router.get('/logout', user_controller.logout_user)
module.exports = router