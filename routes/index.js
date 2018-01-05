'use strict';
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.loggedIn) {
        if (req.cookies.history) {
            var redirect = req.cookies.history;
            res.clearCookie('history');
            res.redirect(redirect);
        }
        else {
            res.render('index', { title: 'Application', loggedin: req.session.loggedIn, name: req.session.name });
        }
    }
    else {
        res.render('index', { title: 'Application' });
    }
});

router.get('/index', function (req, res) {
    res.clearCookie('history');
    res.render('index', { title: 'Application', loggedin: req.session.loggedIn, name: req.session.name });
});


module.exports = router;
