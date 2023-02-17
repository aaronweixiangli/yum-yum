const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review');

module.exports = {
    toggleFavorites,
    viewFavorites,
    viewReviews
}

async function viewReviews(req, res, next) {
    // first populate user.reviews to have an array of review objects
    // then do a nested populate for reviews.restaurant to have an array of restaurant objects
    const user = await User.findById(req.user._id).populate({
        path: 'reviews',
        populate: {
            path: 'restaurant',
            model: 'Restaurant'
        }
    });
    console.log(user);
    res.render('users/reviews', { title: 'My Reviews', user })
}

async function viewFavorites(req, res, next) {
    const user = await User.findById(req.user._id).populate('favorites');
    const restaurants = user.favorites;
    res.render('users/favorites', { title: 'My Favorites', restaurants })
}

async function toggleFavorites(req, res, next) {
    const restaurant = await Restaurant.findOne({ 'id': req.params.id });
    const restaurantObjectId = restaurant._id;
    const user = await User.findById(req.user._id);
    // Delete the restaurant ObjectId if there is one
    // Else, push it into the favorites array
    if (user.favorites.includes(restaurantObjectId)) {
        user.favorites.pull(restaurantObjectId)
    } else {
        user.favorites.push(restaurantObjectId);
    }
    await user.save();
    res.redirect(`/restaurants/${req.params.id}`);
}