var express = require('express');
var router = express.Router();
const restaurantsCtrl = require('../controllers/restaurants');

const bearer = process.env.YELP_API_KEY;
const clientId = process.env.YELP_CLIENT_ID;
const ROOT_URL = 'https://api.yelp.com/v3';

// Mount to path '/restaurants'

// GET /restaurants
router.get('/', restaurantsCtrl.index);

// GET /restaurants/:id
router.get('/:id', restaurantsCtrl.show);

module.exports = router;
