/**
 * Created by lenovo on 7/13/2017.
 */
'use strict'
var passport = require('../config/passport');

passport.EmailDuplication('awaiskhurshed@gmail.com');

var chai = require('chai');
var expect = chai.expect;

    chai.should();

function returnsName(name){
    return name;
};

describe('Sample Unit Test',function(){
    it('Returns a name passed to the function',function () {
        returnsName('AK').should.equal('AK');
    });
});


describe('Email Availability Test',function(){
    it('Returns a email avaailable or not',function () {
        passport.EmailDuplication('awaiskhurshed@gmail.com').equal('awaiskhurshed@gmail.com');
    });
});