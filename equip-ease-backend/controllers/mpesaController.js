const axios = require('axios');
const { getAccessToken, generateSTKPushPayload } = require('../utils/mpesaUtils');

let paymentStatusStore = {};

exports.initiateSTKPush = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const token = await getAccessToken();
    const payload = generateSTKPushPayload({ phoneNumber, amount });

    const mpesaRes = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const checkoutRequestID = mpesaRes.data.CheckoutRequestID;
    paymentStatusStore[checkoutRequestID] = 'pending';

    res.json({ success: true, checkoutRequestID });
  } catch (err) {
    console.error('STK Push error:', err?.response?.data || err.message);
    res.status(500).json({ success: false, error: 'STK Push initiation failed' });
  }
};

exports.checkSTKStatus = (req, res) => {
  const { checkoutRequestID } = req.params;
  const status = paymentStatusStore[checkoutRequestID] || 'pending';
  res.json({ status });
};

exports.handleCallback = (req, res) => {
  const callbackData = req.body;

  const checkoutRequestID = callbackData?.Body?.stkCallback?.CheckoutRequestID;
  const resultCode = callbackData?.Body?.stkCallback?.ResultCode;

  if (checkoutRequestID) {
    paymentStatusStore[checkoutRequestID] = resultCode === 0 ? 'success' : 'failed';
    console.log(`Callback received. Payment status for ${checkoutRequestID}: ${paymentStatusStore[checkoutRequestID]}`);
  }

  res.json({ message: 'Callback received' });
};
