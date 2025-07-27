const express = require('express');
const router = express.Router();
const {
  initiateSTKPush,
  checkSTKStatus,
  handleCallback
} = require('../controllers/mpesaController');

router.post('/stkpush', initiateSTKPush);
router.get('/stkpush/status/:checkoutRequestID', checkSTKStatus);
router.post('/mpesa/callback', handleCallback);

module.exports = router;
