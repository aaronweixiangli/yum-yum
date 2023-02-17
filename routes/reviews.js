const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews.js');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// All routes 'starts with' / (root)

// GET /restaurants/:id/reviews/new
router.get('/restaurants/:id/reviews/new', ensureLoggedIn, reviewsCtrl.new);

// GET /restaurants/:id/reviews/all
router.get('/restaurants/:id/reviews/all', reviewsCtrl.allReviews);

// POST /restaurants/:id/reviews
router.post('/restaurants/:id/reviews', ensureLoggedIn, reviewsCtrl.create);

// DELETE /restaurants/:restaurantId/reviews/:reviewId
router.delete('/restaurants/:restaurantId/reviews/:reviewId', ensureLoggedIn, reviewsCtrl.delete);

// GET /restaurants/:restaurantId/reviews/:reviewId/edit
router.get('/restaurants/:restaurantId/reviews/:reviewId/edit', ensureLoggedIn, reviewsCtrl.edit);

// PUT /restaurants/:restaurantId/reviews/:reviewId
router.put('/restaurants/:restaurantId/reviews/:reviewId', ensureLoggedIn, reviewsCtrl.update);

module.exports = router;
