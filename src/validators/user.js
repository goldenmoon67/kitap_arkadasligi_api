const { body } = require('express-validator');
const userHandler=require("../features/user/handler")
exports.nickName = body("nickName").optional()
.isLength({min:3}).withMessage("nickName should not be less then 3 character")
.custom(async (value) => {

    const existingUser = await userHandler.findByNickName(value);


    if (existingUser ) {
      throw new Error("This nickname is already taken.");
    }

    return true;
  });