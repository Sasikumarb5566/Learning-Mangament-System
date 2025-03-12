const express = require('express');
const router = express.Router();
const { generateOtp, verifyOtp } = require('../../controllers/OtpController');
const { loginVerify } = require('../../controllers/LoginController');

router.post('/generate', generateOtp);
router.post('/verify', verifyOtp);
router.post('/login', loginVerify);

module.exports = router;
