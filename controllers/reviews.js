const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review');
const bearer = process.env.YELP_API_KEY;
const ROOT_URL = 'https://api.yelp.com/v3/businesses';

module.exports = {
    new: newReview,
    create,
    delete: deleteReview,
    edit,
    update,
    allReviews
};

async function allReviews(req, res, next) {
    const id = req.params.id;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${bearer}`
        }
    };
    try {
        const error = null;
        const restaurant = await fetch(`${ROOT_URL}/${id}`, options)
            .then(res => res.json());
        const restaurantMongo = await Restaurant.findOne({ id: id }).populate('reviews');
        res.render('reviews/all', { title: 'All Reviews', error, restaurantMongo, restaurant });
    } catch (error) {
        const restaurantMongo = null;
        res.render('reviews/all', { title: 'All Reviews', restaurantMongo, error });
    }
}

async function update(req, res, next) {
    const reviewId = req.params.reviewId;
    const restaurantApiId = req.params.restaurantId;
    try {
        // Find the review in the database and update its properties
        const review = await Review.findById(reviewId);
        review.rating = req.body.rating;
        review.content = req.body.content;
        await review.save();
        res.redirect(`/restaurants/${restaurantApiId}`);
    } catch (err) {
        next(err);
    }
}

async function edit(req, res, next) {
    const restaurantApiId = req.params.restaurantId;
    const reviewId = req.params.reviewId;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${bearer}`
        }
    };
    try {
        const review = await Review.findById(reviewId);
        const restaurant = await fetch(`${ROOT_URL}/${restaurantApiId}`, options)
            .then(res => res.json());
        const error = null;
        res.render('reviews/edit', { title: 'Edit Review', restaurant, error, review });
    } catch (error) {
        const restaurant = null;
        res.render('reviews/edit', { title: 'Error', restaurant, error });
    }
}

async function deleteReview(req, res, next) {
    const reviewId = req.params.reviewId;
    const userId = req.user._id;
    const restaurantApiId = req.params.restaurantId;
    try {
        // review object has a restaurant property that stores the restaurant objectId
        // remove the review from the Review Collection in MongoDB
        const review = await Review.findById(reviewId);
        await review.remove();
        // Pull the review objectId from the reviews array in both User and Restaurant collections
        await User.updateOne({ _id: userId }, { $pull: { reviews: reviewId } });
        // use id instead of _id since this is the restaurant id from yelp api
        await Restaurant.updateOne({ id: restaurantApiId }, { $pull: { reviews: reviewId } });
        res.redirect(`/restaurants/${req.params.restaurantId}`)
    } catch (err) {
        next(err);
    }
}

function create(req, res) {
    Restaurant.findOne({ 'id': req.params.id }, function (err, restaurant) {
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
        req.body.restaurant = restaurant._id;
        // create a new review object
        const review = new Review(req.body);
        review.save(async function (err, review) {
            // push the review ObjectId into both the corresponding restaurant and user's
            // reviews array
            restaurant.reviews.push(review._id);
            await restaurant.save();
            const user = await User.findOne({ _id: req.user._id });
            user.reviews.push(review._id);
            await user.save();
            res.redirect(`/restaurants/${restaurant.id}`);
        });
    });
}

async function newReview(req, res, next) {
    const id = req.params.id;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${bearer}`
        }
    };
    try {
        const restaurant = await fetch(`${ROOT_URL}/${id}`, options)
            .then(res => res.json());
        const error = null;
        res.render('reviews/new', { title: 'Post Review', restaurant, error });
    } catch (error) {
        const restaurant = null;
        res.render('reviews/new', { title: 'Error', restaurant, error });
    }
}