const express = require('express');
const router = express.Router();
const authValidator = require("../validators/auth");
const registerService = require('../../src/features/auth/register/service');
const loginService = require('../../src/features/auth/login/service');
const authService = require('../features/auth/login/handler');


//REGISTER
router.post('/register', [authValidator.emailValidator],
 registerService.sendRegisterMail);

 //REGISTER 2
router.post('/verify-email', [
    authValidator.emailValidator,
    authValidator.otpCodeValidator,
    authValidator.passwordValidator,
],
    registerService.verifyEmail
);
//RESET PASSWORD
router.post('/reset-password',
    [
        authValidator.emailValidator,
    ],
    authService.authenticate,
    registerService.resetPassword,
);
//LOGIN
router.post('/login',
    [
        authValidator.emailValidator,
    ],
    loginService.login
);
module.exports = router;
