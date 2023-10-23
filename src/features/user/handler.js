const User = require('../../models/user');
const Consts = require("../../consts/consts");


exports.findUserByID = async (userId) => {
  const user = await User.findOne({
    userId
  });
  if (!user) {
    return false;
  }
  return user;
};

exports.updateUser = async (updatedData,errorMessage) => {
  const userId = updatedData.userId;
  const updatedUser = await User.findOneAndUpdate({
    userId
  }, updatedData);
  if (!updatedUser) {
    const error = new Error(errorMessage);
    error.statusCode = 404;
    throw error;
  }
  return updatedUser;
}
exports.findByNickName = async (nickName) => {
  const user = await User.findOne({
    nickName:{$regex : nickName.toString(), "$options": "i" }
  });
  if (!user) {
    return false;
  }
  return user;
};

exports.getUsers = async (limit, page) => {
  const options = {
      page: page || 1,
      limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
  };

  const response = await User.paginate({}, options);
  return response;
};
