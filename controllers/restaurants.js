const bearer = process.env.YELP_API_KEY;
const clientId = process.env.YELP_CLIENT_ID;
const ROOT_URL = 'https://api.yelp.com/v3';

module.exports= {
    index,
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
        const restaurantsData = await fetch(`https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}&limit=50`, options)
            .then(res => res.json())
        const error = null;
        res.render('restaurants/index', {title: 'Restaurants', restaurantsData, error})
    } catch (error) {
        const restaurantsData = null;
        res.render('restaurants/index', {title: 'Restaurants', restaurantsData, error})
    }
}