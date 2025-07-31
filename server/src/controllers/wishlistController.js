const Wishlist = require('../models/Wishlist');
const Product = require('../models/AddPost');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'Product_name Product_price Product_image Product_category');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({
      message: 'Wishlist fetched successfully',
      wishlist: wishlist.products
    });
  } catch (err) {
    console.error('Get Wishlist Error:', err);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Check if product is already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    // Return updated wishlist
    wishlist = await wishlist.populate('products', 'Product_name Product_price Product_image Product_category');

    res.json({
      message: 'Product added to wishlist',
      wishlist: wishlist.products
    });
  } catch (err) {
    console.error('Add to Wishlist Error:', err);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    // Return updated wishlist
    wishlist = await wishlist.populate('products', 'Product_name Product_price Product_image Product_category');

    res.json({
      message: 'Product removed from wishlist',
      wishlist: wishlist.products
    });
  } catch (err) {
    console.error('Remove from Wishlist Error:', err);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
      message: 'Wishlist cleared',
      wishlist: []
    });
  } catch (err) {
    console.error('Clear Wishlist Error:', err);
    res.status(500).json({ message: 'Error clearing wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
}; 