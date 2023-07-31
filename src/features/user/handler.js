const User = require('../../models/user');


exports.findUserByID = async (userId) => {
  const user = await User.findOne({
    userId
  });
  if (!user) {
    return false;
  }
  return user;
};

exports.updateUser = async (updatedData) => {
  const userId = updatedData.userId;
  const updatedUser = await User.findOneAndUpdate({
    userId
  }, updatedData);
  if (!updatedUser) {
    const error = new Error("User does not exists");
    error.statusCode = 404;
    throw error;
  }
  return updatedUser;
}
exports.findByNickName = async (nickName) => {
  const user = await User.findOne({
    nickName
  });
  if (!user) {
    return false;
  }
  return user;
};