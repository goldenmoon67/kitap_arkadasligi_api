const express = require('express');
const router = express.Router()
const registerhHandler = require('../../src/features/auth/register/service');
const loginHandler = require('../../src/features/auth/login/service');


router.post('/register', registerhHandler.sendRegisterMail);
router.post('/verify-email', registerhHandler.verifyEmail);
router.post('/login', loginHandler.login);
module.exports = router;
