const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review');
const bearer = process.env.YELP_API_KEY;
const clientId = process.env.YELP_CLIENT_ID;
const ROOT_URL = 'https://api.yelp.com/v3/businesses';

module.exports = {
    new: newReview,
    create,
    delete: deleteReview
};

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
        await User.updateOne({_id: userId}, {$pull: { reviews: reviewId }});
        // use id instead of _id since this is the restaurant id from yelp api
        await Restaurant.updateOne({id: restaurantApiId}, {$pull: { reviews: reviewId }});
        res.redirect(`/restaurants/${req.params.restaurantId}`)
    } catch (err) {
        next(err);
    }
}

function create(req, res) {
    Restaurant.findOne({'id': req.params.id}, function(err, restaurant) {
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
        req.body.restaurant = restaurant._id;
      // create a new review object
        const review = new Review(req.body);
        review.save(async function(err, review) {
            // push the review ObjectId into both the corresponding restaurant and user's
            // reviews array
            restaurant.reviews.push(review._id);
            await restaurant.save();
            const user = await User.findOne({id: req.user._id});
            user.reviews.push(review._id);
            await user.save();
            res.redirect(`/restaurants/${restaurant.id}`);
        });
    });
}
    //   console.log(req.restaurant);
    //   req.body.restaurant = req.restaurant._id;
    //   req.body.restaurant = restaurant._id;
    //   console.log(req.body)
    //   restaurant.reviews.push(req.body);
    //   console.log(restaurant.reviews, "This is restaurant.reviews");
    //   restaurant.save(async function(err) {
    //     let user = await User.findOne({'id': req.params.id});
    //     user.reviews.push(req.body);
    //     console.log(user, 'user');
    //     await user.save()
    //     res.redirect(`/restaurants/${restaurant.id}`);
    //   });
    // });
// }

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
        res.render('reviews/new', {title: 'Post Review', restaurant, error});
    } catch (error) {
        const restaurant = null;
        res.render('reviews/new', {title: 'Error', restaurant, error});
    }
}