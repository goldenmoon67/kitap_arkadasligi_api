const { body } = require('express-validator');


exports.emailValidator = body("email")
    .isEmail().
    withMessage("Please enter a valid email");

exports.passwordValidator = body("password")
    .isStrongPassword({
        minLength: 8, minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    })
    .withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number");

exports.otpCodeValidator = body("password")
    .isStrongPassword({
        minLength: 8, minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    })
    .withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number");