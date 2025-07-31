const express = require('express');
const wishlistRouter = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');
const userMiddleware = require('../middleware/userMiddleware');

// All routes require user authentication
wishlistRouter.use(userMiddleware);

// Get user's wishlist
wishlistRouter.get('/', getWishlist);

// Add product to wishlist
wishlistRouter.post('/add', addToWishlist);

// Remove product from wishlist
wishlistRouter.delete('/remove/:productId', removeFromWishlist);

// Clear wishlist
wishlistRouter.delete('/clear', clearWishlist);

module.exports = wishlistRouter; 