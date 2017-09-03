const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  category: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  brand: {
    required: true,
    type: String
  },
  model: {
    required: true,
    type: String
  },
  imageUrl: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number
  },
  description: {
    required: true,
    type: String
  }
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
