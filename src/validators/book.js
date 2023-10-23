const { body } = require('express-validator');

exports.categoryValidator= body('categories')
.not().isEmpty()
.isArray().withMessage((value, { req, location, path }) => {
  return req.t(  "valid-categories-message");
});

exports.authorValidator=body('author')
.not().isEmpty()
.isMongoId().withMessage((value, { req, location, path }) => {
  return req.t( "valid-author-id-message");
});

exports.pageCountValidayor=body('pageCount')
.not().isEmpty()
.isNumeric()
.bail()
.custom((value,{ req, location, path }) => {
  if (!value >1) {
    const error= new Error(req.t("valid-page-count-message"));
    error.statusCode=422;
    throw error;
  }


  return true; 
});