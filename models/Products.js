const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: { type: String, enum: ['men', 'women', 'kids'], required: true },
  season: { type: String, enum: ['summer', 'winter'], required: true }
});

module.exports = mongoose.model('Product', productSchema);
