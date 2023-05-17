const express = require('express');
const router = express.Router()
const registerhHandler = require('../../src/features/auth/register/service');


router.post('/register', registerhHandler.sendRegisterMail);
router.post('/register-verify', registerhHandler.sendRegisterMail);







module.exports = router;
