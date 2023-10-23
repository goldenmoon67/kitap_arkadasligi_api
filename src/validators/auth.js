const { body } = require('express-validator');


exports.emailValidator = body("email")
    .isEmail().
    withMessage((value, { req, location, path }) => {
        return req.t("enter-a-valid-email");
    });

exports.passwordValidator = body("password")
    .isStrongPassword({
        minLength: 8, minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    })
    .withMessage((value, { req, location, path }) => {
        return req.t("valid-password-message");
    });

exports.otpCodeValidator = body("otpCode")
    .isNumeric({
     no_symbols:true,
    }).isLength({max:6,min:6})
    .withMessage((value, { req, location, path }) => {
        return req.t("valid-otp-code-message");
    });