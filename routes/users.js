const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const usersCtrl = require('../controllers/users');

// All routes 'starts with' / (root)

// GET /resturants/:id/favorites
router.get('/restaurants/:id/favorites', ensureLoggedIn, usersCtrl.toggleFavorites);

// GET /user/favorites
router.get('/user/favorites', ensureLoggedIn, usersCtrl.viewFavorites);

// GET /user/reviews
router.get('/user/reviews', ensureLoggedIn, usersCtrl.viewReviews)

module.exports = router;