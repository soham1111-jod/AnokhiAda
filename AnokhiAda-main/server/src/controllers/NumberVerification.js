const axios = require('axios');
const baseURL = 'https://cpaas.messagecentral.com';

// Example list of temp SMS providers' numbers/prefixes
const TEMP_NUMBER_PREFIXES = [
  // UK virtual numbers
  "447520", "447781", "447404", "447480", "447937",
  // US disposable ranges
  "12512", "12513", "12514", "14703", "14704", "14705",
  // Canada
  "14388", "14389", "15878", "15879",
  // India virtual
  "917011", "917012", "917013", "919028", "919029",
  // UAE temp ranges
  "97158", "97156", "97157",
  // Australia virtual
  "61437", "61438", "61439",
  // France
  "33756", "33757", "33758",
  // Germany
  "49157", "49159", "49160",
  // Russia
  "79215", "79216", "79217",
  // More global common disposable services
  "447404", "447937", "48500", "48501", "37060", "37061",
  "39351", "39352", "35193", "35194", "35845", "35846","+1000", "+1001", "+1002", "+1003", "+1004", "+1005", "+1006", "+1007", "+1008", "+1009",
  "+4410", "+4411", "+4412", "+4413", "+4414", "+4415", "+4416", "+4417", "+4418", "+4419",
  "+9110", "+9111", "+9112", "+9113", "+9114", "+9115", "+9116", "+9117", "+9118", "+9119",
  "+6100", "+6101", "+6102", "+6103", "+6104", "+6105", "+6106", "+6107", "+6108", "+6109",
  "+3300", "+3301", "+3302", "+3303", "+3304", "+3305", "+3306", "+3307", "+3308", "+3309"
];


// Simple check function
function isTempNumber(mobileNumber) {
  return TEMP_NUMBER_PREFIXES.some(prefix => mobileNumber.startsWith(prefix));
}

async function getAuthToken() {
  const key = Buffer.from(process.env.MC_PASSWORD).toString('base64');
  const params = {
    customerId: process.env.MC_CUSTOMER_ID,
    email: process.env.MC_EMAIL,
    key,
    scope: 'NEW'
  };
  const url = `${baseURL}/auth/v1/authentication/token`;
  const res = await axios.get(url, { params });
  return res.data.token;
}

async function sendOtp(req, res) {
  const { countryCode, mobileNumber } = req.body;
  if (!countryCode || !mobileNumber) {
    return res.status(400).json({ success: false, message: 'countryCode and mobileNumber are required' });
  }

  // Check if number is from temp/disposable range
  if (isTempNumber(mobileNumber)) {
    return res.status(400).json({
      success: false,
      message: 'Temporary/disposable numbers are not allowed'
    });
  }

  try {
    const token = await getAuthToken();
    const params = {
      customerId: process.env.MC_CUSTOMER_ID,
      countryCode,
      flowType: 'SMS',
      mobileNumber
    };
    const url = `${baseURL}/verification/v3/send`;
    const response = await axios.post(url, null, { params, headers: { authToken: token }});
    const data = response.data.data;
    if (response.data.responseCode === 200 && !data.errorMessage) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        verificationId: data.verificationId,
        timeout: data.timeout
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to send OTP',
        error: data.errorMessage || response.data.message
      });
    }
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
}


async function verifyOtp(req, res) {
  const { countryCode, mobileNumber, verificationId, code } = req.body;
  if (!countryCode || !mobileNumber || !verificationId || !code) {
    return res.status(400).json({ success: false, message: 'countryCode, mobileNumber, verificationId, and code are required' });
  }
  try {
    const token = await getAuthToken();
    const params = {
      customerId: process.env.MC_CUSTOMER_ID,
      countryCode,
      mobileNumber,
      verificationId,
      code
    };
    const url = `${baseURL}/verification/v3/validateOtp`;
    const response = await axios.get(url, { params, headers: { authToken: token }});
    const data = response.data.data;
    if (data.verificationStatus === 'VERIFICATION_COMPLETED' && !data.errorMessage) {
      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      // Handle wrong OTP or other verification failure
      return res.status(400).json({
        success: false,
        message: 'OTP verification failed',
        error: data.errorMessage || response.data.message
      });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
}


module.exports = { sendOtp, verifyOtp };
