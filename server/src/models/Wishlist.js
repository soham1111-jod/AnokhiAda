const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Ensure each product appears only once in a user's wishlist
wishlistSchema.index({ user: 1, 'products': 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema); 