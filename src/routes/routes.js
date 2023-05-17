const express = require('express');
const router = express.Router()
const registerhHandler = require('../../src/features/auth/register/service');


router.post('/register', registerhHandler.sendRegisterMail);
router.post('/verify-email', registerhHandler.verifyEmail);







module.exports = router;
