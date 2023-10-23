const {validationResult ,body } = require('express-validator');
const userHandler=require("../features/user/handler")


exports.nickName = body("nickName").optional()
.isLength({min:3}).withMessage((value, { req, location, path }) => {
  return req.t( "valid-nickname-message");
})
.custom(async (value,{ req, location, path }) => {
    const existingUser = await userHandler.findByNickName(value);
    if (existingUser) {
      throw new Error( req.t(  "nickname-already-taken"));
    }
    return true;
  });