const bearer = process.env.YELP_API_KEY;
const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
const ROOT_URL = 'https://api.yelp.com/v3/businesses';
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

module.exports = {
    index,
    show,
}

async function show(req, res, next) {
    const id = req.params.id;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${bearer}`
        }
    };
    function formatTime(time) {
        let formattedTime = '';
        let hours = parseInt(time.slice(0, 2));
        let minutes = time.slice(2, 4);
        let period = 'AM';
        if (hours >= 12) {
            period = 'PM';
            hours -= 12;
        }
        if (hours === 0) {
            hours = 12;
        }
        formattedTime = hours + ':' + minutes + ' ' + period;
        return formattedTime;
    }
    try {
        const restaurant = await fetch(`${ROOT_URL}/${id}`, options)
            .then(res => res.json());
        let yelpReviews = await fetch(`${ROOT_URL}/${id}/reviews?limit=20&sort_by=yelp_sort`, options)
            .then(res => res.json());
        yelpReviews = yelpReviews.reviews;
        const error = null;
        // create a mongoDB for restaurant if it does not exist yet
        let restaurantMongo = await Restaurant.findOne({ id: id }).populate('reviews');
        if (!restaurantMongo) {
            const newRestaurant = {
                id: restaurant.id,
                name: restaurant.name,
                city: restaurant.location.city,
                state: restaurant.location.state,
                price: restaurant.price,
                rating: restaurant.rating,
                image_url: restaurant.image_url,
                categories: restaurant.categories
            };
            restaurantMongo = await Restaurant.create(newRestaurant);
        };
        // if the user has logged in, get the user data
        let user;
        if (req.user) {
            user = await User.findById(req.user._id);
        }
        res.render('restaurants/show', { title: 'Restaurant', restaurant, error, yelpReviews, restaurantMongo, formatTime, user, GOOGLE_MAP_API_KEY });
    } catch (error) {
        const restaurant = null;
        res.render('restaurants/show', { title: 'Restaurant', restaurant, error });
    }
}

async function index(req, res, next) {
    const term = req.query.term || '';
    const location = req.query.location;
    const categories = req.query.categories || '';
    const price = req.query.price || '';
    const open_now = req.query.open_now || '';
    let attributes = req.query.attributes || '';
    let attributesArr;
    if (Array.isArray(req.query.attributes)) {
        attributesArr = req.query.attributes; //Array
        attributes = req.query.attributes.join('&2C');
    } else {
        attributesArr = [req.query.attributes]; //Array with one string
    }
    const sort_by = req.query.sort_by || 'best_match';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${bearer}`
        }
    };
    try {
        // price must be a number for yelp API
        let restaurantsData;
        if (price) {
            restaurantsData = await fetch(`${ROOT_URL}/search?location=${location}&term=${term}&categories=${categories}&price=${price}&open_now=${open_now}&attributes=${attributes}&sort_by=${sort_by}&limit=50`, options)
                .then(res => res.json())
        } else {
            restaurantsData = await fetch(`${ROOT_URL}/search?location=${location}&term=${term}&categories=${categories}&open_now=${open_now}&attributes=${attributes}&sort_by=${sort_by}&limit=50`, options)
                .then(res => res.json())
        };
        const error = null;
        const restaurantsPerPage = 10;
        let currentPage = parseInt(req.query.page) || 1;
        let startIndex = (currentPage - 1) * restaurantsPerPage;
        let endIndex = startIndex + restaurantsPerPage - 1;
        let numOfPages = Math.ceil(restaurantsData.businesses.length / restaurantsPerPage);
        let pageRestaurants = restaurantsData.businesses.slice(startIndex, endIndex + 1);
        // Check if there is a next page
        const hasNextPage = currentPage * restaurantsPerPage < restaurantsData.businesses.length;
        // Check if there is a previous page
        const hasPrevPage = currentPage > 1;


        console.log(term, 'term');
        console.log(location, 'location');
        console.log(categories, 'categories');
        console.log(price, 'price');
        console.log(open_now, 'open now');

        console.log(attributes, "attribues");
        console.log(sort_by, "sort_by");
        res.render('restaurants/index', {
            title: 'Restaurants', error,
            pageRestaurants, numOfPages,
            hasNextPage, hasPrevPage,
            currentPage, term, location,
            categories, price, open_now,
            attributes: attributesArr.map(attr => `attributes=${attr}`).join('&') || 'attributes=',
            attributesArr, sort_by
        })
    } catch (error) {
        const restaurantsData = null;
        res.render('restaurants/index', { title: 'Restaurants', restaurantsData, error })
    }
}

