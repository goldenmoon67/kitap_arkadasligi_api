const { body } = require('express-validator');

exports.categoryValidator= body('categories')
.not().isEmpty().withMessage('Categories cant not be null and it should be an array')
.isArray().withMessage('Categories cant not be empty and it should be an array');

exports.authorValidator=body('author')
.not().isEmpty()
.isMongoId().withMessage("Author Id should be defined");

exports.pageCountValidayor=body('pageCount')
.not().isEmpty()
.isNumeric()
.bail()
.custom((value) => {
  if (!value >1) {
    const error= new Error('pageCount should be greater than 1');
    error.statusCode=422;
    throw error;
  }


  return true; 
});