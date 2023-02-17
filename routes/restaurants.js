var express = require('express');
var router = express.Router();
const restaurantsCtrl = require('../controllers/restaurants');


// Mount to path '/restaurants'

// GET /restaurants
router.get('/', restaurantsCtrl.index);

// GET /restaurants/:id
router.get('/:id', restaurantsCtrl.show);

module.exports = router;
