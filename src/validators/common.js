const { body } = require('express-validator');

exports.nameValidator = body("name")
.isLength({min:3})
.not().isEmpty()
.withMessage((value, { req, location, path }) => {
    return req.t( "valid-name-message");
  });


exports.imageUrlValidator= body('imageUrl').optional()
.isURL().withMessage((value, { req, location, path }) => {
    return req.t( "valid-image-url-message");
  });

exports.fullNameValidator = body("fullName")
.isLength({min:3})
.not().isEmpty()
.withMessage((value, { req, location, path }) => {
    return req.t("valid-name-message");
  });
