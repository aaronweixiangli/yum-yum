const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  id: String,
  name: String,
  city: String,
  state: String,
  image_url: String,
  categories: [Object],
  rating: Number,
  price: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);