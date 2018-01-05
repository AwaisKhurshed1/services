var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
router.use(csrfProtection);
/**
*  File to handle the routes of
   related to the authentication
   and security of the app
 */

/*
  Start of Routes related to signup
 */
router.get('/user/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/index',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

/*
 End of Routes related to signup
 */

/*
 Start of Routes related to signin to the app
 */
router.get('/user/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signin', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

/*
 End of Routes related to signin to the app
 */

// signout route
router.get('/user/signout', function (req, res, next) {
    req.session.destroy();

    res.redirect('/');
});

// profile route
router.get('/user/profile', function (req, res, next) {
    res.render('user/profile');
});


module.exports = router;