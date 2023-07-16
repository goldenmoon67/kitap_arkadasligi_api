const express = require('express');
const router = express.Router()
const registerhHandler = require('../../src/features/auth/register/service');
const loginHandler = require('../../src/features/auth/login/service');
const userHandler = require('../../src/features/user/service');
const authHandler = require('../features/auth/login/handler');
const authValidator = require("../validators/auth");



//REGISTER
router.post('/register', [authValidator.emailValidator], registerhHandler.sendRegisterMail);

//REGISTER 2
router.post('/verify-email', [
    authValidator.emailValidator,
    authValidator.otpCodeValidator,
    authValidator.passwordValidator,
],
    registerhHandler.verifyEmail
);

//LOGIN
router.post('/login',
    [authValidator.emailValidator,
    authValidator.passwordValidator
    ],
    loginHandler.login
);

//SESSION USER
router.get('/session-user', authHandler.authenticate, userHandler.getUser);

//GET USER{ID}
router.get('/users/:id', authHandler.authenticate, userHandler.getUser);


module.exports = router;
