const bearer = process.env.YELP_API_KEY;
const clientId = process.env.YELP_CLIENT_ID;
const ROOT_URL = 'https://api.yelp.com/v3/businesses';

module.exports= {
    index,
    show
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
    try {
        const restaurant = await fetch(`${ROOT_URL}/${id}`, options)
            .then(res => res.json());
        const yelpReviews = await fetch(`${ROOT_URL}/${id}/reviews?limit=20&sort_by=yelp_sort`, options)
            .then(res => res.json());
        const error = null;
        res.render('restaurants/show', {title: 'Restaurant', restaurant, error, yelpReviews});
    } catch (error) {
        const restaurant = null;
        res.render('restaurants/show', {title: 'Restaurant', restaurant, error});
    }
}

async function index(req, res, next) {
    const term = req.query.term;
    const location = req.query.location;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${bearer}`
        }
      };
    try {
        const restaurantsData = await fetch(`${ROOT_URL}/search?location=${location}&term=${term}&limit=50`, options)
            .then(res => res.json())
        const error = null;
        res.render('restaurants/index', {title: 'Restaurants', restaurantsData, error})
    } catch (error) {
        const restaurantsData = null;
        res.render('restaurants/index', {title: 'Restaurants', restaurantsData, error})
    }
}