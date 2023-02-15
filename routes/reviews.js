const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews.js');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// All routes 'starts with' / (root)

// GET /restaurants/:id/reviews/new
router.get('/restaurants/:id/reviews/new', ensureLoggedIn, reviewsCtrl.new);

module.exports = router;
