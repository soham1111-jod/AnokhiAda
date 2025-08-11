const express = require('express');
const Cashfreerouter = express.Router();
const { createOrder, verifyPayment, getUserOrders } = require('../controllers/Cashfreegetway');

Cashfreerouter.post('/create', createOrder);       
Cashfreerouter.post('/verify', verifyPayment);      
Cashfreerouter.get('/my-orders/:userId', getUserOrders); 

module.exports = Cashfreerouter;
