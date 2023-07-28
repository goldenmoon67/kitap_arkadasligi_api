const { body } = require('express-validator');

exports.fullNameValidator = body("fullName")
.isLength({min:3}).withMessage("Name should be more then 3 character")
.not().isEmpty()
.withMessage("Name should not be emty");
