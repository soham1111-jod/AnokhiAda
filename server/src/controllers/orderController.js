const Order = require("../models/Order");
const User = require("../models/user");
const { createNotification } = require("./notificationController");

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items?.length) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: "pending",
      status: "pending",
    });

    await createNotification(
      req.user._id,
      "Order Placed Successfully",
      `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed and is being processed.`,
      "order",
      order._id
    );

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName email")
      .sort("-createdAt");

    res.json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort("-createdAt");

    res.json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    console.error("Get User Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "firstName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role !== "admin" &&
      order.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("userId", "firstName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const notificationMessages = {
      processing: "Your order is now being processed.",
      shipped: "Your order has been shipped! Track your delivery.",
      delivered: "Your order has been delivered. Enjoy!",
      cancelled: "Your order has been cancelled.",
    };

    if (notificationMessages[status]) {
      await createNotification(
        order.userId._id,
        `Order Status Updated: ${status.toUpperCase()}`,
        `Order #${order._id.toString().slice(-6).toUpperCase()}: ${notificationMessages[status]}`,
        "order",
        order._id
      );
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;

    const order = await Order.findById(req.params.id).populate("userId", "firstName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }
    await order.save();

    const notificationMessages = {
      paid: "Payment received successfully for your order.",
      failed: "Payment failed for your order. Please try again.",
      pending: "Payment is pending for your order.",
    };

    if (notificationMessages[paymentStatus]) {
      await createNotification(
        order.userId._id,
        `Payment Status: ${paymentStatus.toUpperCase()}`,
        `Order #${order._id.toString().slice(-6).toUpperCase()}: ${notificationMessages[paymentStatus]}`,
        "order",
        order._id
      );
    }

    res.json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Update Payment Status Error:", err);
    res.status(500).json({ message: "Error updating payment status" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
};
