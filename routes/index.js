var express = require('express');
var router = express.Router();
const passport = require('passport');


const bearer = process.env.YELP_API_KEY;
const clientId = process.env.YELP_CLIENT_ID;
const ROOT_URL = 'https://api.yelp.com/v3';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'YumYum' });
});

router.get('/auth/google', passport.authenticate(
  // passport strategy
  'google',
  {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res) {
  req.logout(function() {
    res.redirect('/');
  });
})

module.exports = router;
