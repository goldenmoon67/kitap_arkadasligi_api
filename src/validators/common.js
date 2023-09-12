const { body } = require('express-validator');

exports.nameValidator = body("name")
.isLength({min:3}).withMessage("Name should not be emty and less then 3 character")
.not().isEmpty()
.withMessage("Name should not be emty and less then 3 character");


exports.imageUrlValidator= body('imageUrl').optional()
.isURL().withMessage("ImageUrl should be an Url");

exports.fullNameValidator = body("fullName")
.isLength({min:3}).withMessage("Name should be more then 3 character")
.not().isEmpty()
.withMessage("Name should not be emty");
