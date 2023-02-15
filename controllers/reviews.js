const Restaurant = require('../models/restaurant');

module.exports = {
    new: newReview
};

function newReview(req, res, next) {
    const id = req.params.id;
    console.log(`id:${req.params.id}`)
    res.render('reviews/new', {
        title: 'Add Review',
        id
    })
}