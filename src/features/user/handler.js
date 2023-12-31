const User = require('../../models/user');
const Consts = require("../../consts/consts");


exports.findUserByID = async (userId) => {
  const user = await User.aggregate([
    { $match: { userId:userId } },
    {
      $lookup: {
          from: 'books', // Kitapların saklandığı koleksiyonun adı
          localField: 'books', // User modelindeki kitap ID'leri
          foreignField: '_id', // Book modelindeki eşleşen ID alanı
          as: 'bookDetails' // Sonuçların ekleneceği alan
      }
  },
  {
    $project: {
        userId: 1,
        nickName: 1,
        email: 1,
        imageUrl: 1,
        friends: 1,
        books: "$bookDetails", // Burada bookDetails alanını books olarak adlandırıyoruz
        movies: 1,
        series: 1,
        advertisements: 1,
        rates: 1
    }
}
]);

console.log(user);
  if (!user) {
    return false;
  }
  return user[0];
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
