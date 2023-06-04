const express = require('express');
const router = express.Router()
const registerhHandler = require('../../src/features/auth/register/service');
const loginHandler = require('../../src/features/auth/login/service');
const userHandler = require('../../src/features/user/service');
const authHandler = require('../features/auth/login/handler');




router.post('/register', registerhHandler.sendRegisterMail);
router.post('/verify-email', registerhHandler.verifyEmail);
router.post('/login', loginHandler.login);
router.get('/users/sessionUser',authHandler.authenticate, userHandler.getSessionUser);
router.get('/users/:id',authHandler.authenticate, userHandler.getUser);


module.exports = router;
