var express = require('express');
var router = express.Router();

/**
 *  File to handle the routes of
 *  Service details
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/detail/graphics', function (req, res, next) {
    var session = req.session;
    if (session.loggedIn) {
        res.clearCookie('history');
        res.cookie('history', '/detail/graphics', { expire: new Date() + 30 * 24 * 60 * 60 * 1000 });
        res.render('detail/graphics', { title: 'Application', loggedin: req.session.loggedIn, name: req.session.name });
    }
    else {
        res.redirect('/user/signin');
    }
});

router.get('/detail/translation', function (req, res, next) {
    var session = req.session;
    if (session.loggedIn) {
        res.clearCookie('history');
        res.cookie('history', '/detail/translation', { expire: new Date() + 30 * 24 * 60 * 60 * 1000 });
        res.render('detail/translation', { title: 'Application', loggedin: req.session.loggedIn, name: req.session.name });
    }
    else {
        res.redirect('/user/signin');
    }
});
module.exports = router;
