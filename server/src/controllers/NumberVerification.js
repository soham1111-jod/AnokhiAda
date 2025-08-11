const axios = require('axios');

// MessageCentral credentials
const SMS_API_KEY = 'your_api_key';
const SMS_SENDER_ID = 'your_sender_id'; // e.g. MSGCEN
const SMS_TEMPLATE_ID = 'your_template_id'; // DLT approved

// Temporary number prefixes to block (add more as needed)
const blockedPrefixes = ['447', '424', '1907', '357', '370'];

// In-memory OTP store (replace with DB for production)
const otpStore = new Map();

// Check if number is temporary
function isTemporaryNumber(number) {
    return blockedPrefixes.some(prefix => number.startsWith(prefix));
}

// Send OTP
const sendOTP = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    if (isTemporaryNumber(phone)) {
        return res.status(400).json({ error: 'Temporary or virtual numbers are not allowed' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(phone, otp.toString());

    const message = `Your OTP is ${otp}`; // Follow exact DLT template

    try {
        const response = await axios.get('https://console.messagecentral.com/api/v1/sms/send', {
            params: {
                apikey: SMS_API_KEY,
                sender: SMS_SENDER_ID,
                number: phone,
                templateid: SMS_TEMPLATE_ID,
                message: message
            }
        });

        res.json({
            success: true,
            message: 'OTP sent successfully',
            api_response: response.data
        });
    } catch (error) {
        console.error('Send OTP error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

// Verify OTP
const verifyOTP = (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const storedOTP = otpStore.get(phone);

    if (storedOTP === otp.toString()) {
        otpStore.delete(phone);
        res.json({ success: true, message: 'OTP verified successfully' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid OTP' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};
