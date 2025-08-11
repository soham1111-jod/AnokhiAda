const axios = require('axios');
const Order = require('../models/Order');
require('dotenv').config();

const { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_BASE_URL } = process.env;

exports.createOrder = async (req, res) => {
    try {
        const { userId, items, shippingAddress, paymentMethod, Contact_number, user_email } = req.body;

        if (paymentMethod === 'cod') {
            const newOrder = new Order({
                userId,
                items,
                shippingAddress,
                paymentMethod,
                paymentStatus: 'pending',
                Contact_number,
                user_email
            });
            await newOrder.save();
            return res.json({ success: true, message: "COD order created", order: newOrder });
        }

        const orderAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

        const response = await axios.post(
            CASHFREE_BASE_URL,
            {
                order_id: `${Date.now()}`,
                order_amount: orderAmount,
                order_currency: "INR",
                customer_details: {
                    customer_id: userId.toString(),
                    customer_email: user_email,
                    customer_phone: Contact_number.toString()
                }
            },
            {
                headers: {
                    'x-client-id': CASHFREE_APP_ID,
                    'x-client-secret': CASHFREE_SECRET_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.json({
            success: true,
            cashfreeSession: response.data,
            tempOrder: { userId, items, shippingAddress, paymentMethod, Contact_number, user_email }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { payment_status, tempOrder } = req.body;

        if (payment_status === 'SUCCESS') {
            const savedOrder = new Order({
                ...tempOrder,
                paymentStatus: 'paid',
                status: 'processing'
            });
            await savedOrder.save();
            return res.json({ success: true, message: "Payment success, order saved", order: savedOrder });
        }

        return res.json({ success: false, message: "Payment failed, order not saved" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
