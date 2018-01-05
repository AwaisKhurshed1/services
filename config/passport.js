var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");

var User = require('../models/user');


/**
 *  Registering the Node Mailer
 *  to send an email
 */

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "awaiskhurshed@gmail.com", //Email ID from which email will be sent
        pass: "" // Email Password
        //Also allow less secure app to login from gmail security.
    }
});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

/**
 * Passport.js have a local strategy and
 * function to Sign Up or Register by
 * giving Nickname, Email and Password
 *
 */

passport.use('local.signup', new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function (req, email, password, done) {
    var session = req.session;
    session.loggedIn = true;
    req.checkBody('email', 'Invalid Email Adress').notEmpty().isEmail();
    req.checkBody('nickname', 'Please enter a nickname').notEmpty();
    req.checkBody('password', 'Password Strength is Weak').notEmpty().isLength({ min: 8 });
    var nickname = req.body.nickname;
    var errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Email is already in use.' });
        }
        var newUser = new User();
        newUser.nickname = nickname;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            var mailOptions = {
                to: email,
                subject: "Welcome Onboard To Services Application",
                text: "We Welcome You On Our Responsive Web Application"
            }
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }
            });
            var session = req.session;
            session.loggedIn = true;
            session.name = newUser.nickname;
            return done(null, newUser);

        });
    });
}));


/**
 * Passport.js have a local strategy and
 * function to get Email and Password
 * and check whether user exists or not
 * if user exists session is set
 *
 */

passport.use('local.signin', new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Please Enter your email').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'No user found with this email.' });
        }
        if (!user.validPassword(password))
        {
            return done(null, false, { message: 'Wrong password.' });
        }

        var session = req.session;
        session.loggedIn = true;
        session.name = user.nickname;
        return done(null, user);
    });
}));


/**
 * This module has been exported to be accessed
 * @type {{EmailDuplication: module.exports.EmailDuplication}}
 */
module.exports ={

    EmailDuplication: function (email) {

        User.findOne({ 'email': email }, function (err, user) {
            console.log('Entered');
            if (err) {
                console.log(err);
                return done(err);
            }
            if (!user) {
                console.log('email is returned');
                return done(null,'false');
            }
            return done(null,user);

        });
    }

};
