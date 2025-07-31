const Order = require('../models/Order');
const User = require('../models/user');
const { createNotification } = require('./notificationController');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    
    if (!items?.length) {
      return res.status(400).json({ message: 'Order must contain items' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending'
    });

    // Create notification for new order
    await createNotification(
      req.user._id,
      'Order Placed Successfully',
      `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed and is being processed.`,
      'order',
      order._id
    );

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName email')
      .sort('-createdAt');
    
    res.json({
      message: 'Orders fetched successfully',
      orders
    });
  } catch (err) {
    console.error('Get All Orders Error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt');
    
    res.json({
      message: 'Orders fetched successfully',
      orders
    });
  } catch (err) {
    console.error('Get User Orders Error:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is admin or order owner
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      message: 'Order fetched successfully',
      order
    });
  } catch (err) {
    console.error('Get Order Error:', err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName email _id');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = orderStatus;
    await order.save();

    // Create notification for status change
    const notificationMessages = {
      processing: 'Your order is now being processed.',
      shipped: 'Your order has been shipped! Track your delivery.',
      delivered: 'Your order has been delivered. Enjoy!',
      cancelled: 'Your order has been cancelled.'
    };

    if (notificationMessages[orderStatus]) {
      await createNotification(
        order.user._id,
        `Order Status Updated: ${orderStatus.toUpperCase()}`,
        `Order #${order._id.toString().slice(-6).toUpperCase()}: ${notificationMessages[orderStatus]}`,
        'order',
        order._id
      );
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName email _id');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.paymentStatus;
    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }
    await order.save();

    // Create notification for payment status change
    const notificationMessages = {
      paid: 'Payment received successfully for your order.',
      failed: 'Payment failed for your order. Please try again.',
      pending: 'Payment is pending for your order.'
    };

    if (notificationMessages[paymentStatus]) {
      await createNotification(
        order.user._id,
        `Payment Status: ${paymentStatus.toUpperCase()}`,
        `Order #${order._id.toString().slice(-6).toUpperCase()}: ${notificationMessages[paymentStatus]}`,
        'order',
        order._id
      );
    }

    res.json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (err) {
    console.error('Update Payment Status Error:', err);
    res.status(500).json({ message: 'Error updating payment status' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus
}; 