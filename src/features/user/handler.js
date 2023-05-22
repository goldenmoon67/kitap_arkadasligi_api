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
