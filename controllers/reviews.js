const Restaurant = require('../models/restaurant');
const bearer = process.env.YELP_API_KEY;
const clientId = process.env.YELP_CLIENT_ID;
const ROOT_URL = 'https://api.yelp.com/v3/businesses';

module.exports = {
    new: newReview,
    create
};

function create(req, res) {
    Restaurant.findOne({'id': req.params.id}, function(err, restaurant) {
      req.body.user = req.user._id;
      req.body.userName = req.user.name;
      req.body.userAvatar = req.user.avatar;
      restaurant.reviews.push(req.body);
      console.log(restaurant.reviews, "This is restaurant.reviews");
      restaurant.save(function(err) {
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
        res.render('reviews/new', {title: 'Post Review', restaurant, error});
    } catch (error) {
        const restaurant = null;
        res.render('reviews/new', {title: 'Error', restaurant, error});
    }
}