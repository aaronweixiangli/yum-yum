var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
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
router.get('/oauth2callback', function (req, res, next) {
  const redirectTo = req.session.redirectTo;
  delete req.session.redirectTo;
  passport.authenticate(
    'google',
    {
      successRedirect: redirectTo || '/', //-> replace '/' as desired
      failureRedirect: '/'
    }
  )(req, res, next);  // Call the middleware returned by passport
});

router.get('/logout', function (req, res) {
  req.logout(function () {
    res.redirect('/');
  });
})

module.exports = router;
