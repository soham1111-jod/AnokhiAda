const express = require('express');
const numberVerifyrouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware")
const { sendOtp, verifyOtp } = require("../controllers/NumberVerification")


numberVerifyrouter.post('/send', userMiddleware, sendOtp);     
numberVerifyrouter.post('/verify', userMiddleware , verifyOtp); 


module.exports = numberVerifyrouter; 