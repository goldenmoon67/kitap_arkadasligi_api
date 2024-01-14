const User = require('../../models/user');
const Consts = require("../../consts/consts");


exports.findUserByID = async (userId) => {
  const user = await User.aggregate([
    { $match: { userId: userId } },
    {
      $lookup: {
        from: 'books',
        localField: 'books',
        foreignField: '_id',
        as: 'bookDetails'
      }
    },
    { $unwind: "$bookDetails" },
    { $sort: { "bookDetails.someField": 1 } }, // 'someField' kitapları sıralamak için kullanılan alan
    {
      $project: {
        userId: 1,
        nickName: 1,
        email: 1,
        imageUrl: 1,
        friends: 1,
        movies: 1,
        series: 1,
        advertisements: 1,
        rates: 1,
        bookDetails: {
          id:"$bookDetails._id",//id
          name: "$bookDetails.name", // Kitabın adı
          imageUrl: "$bookDetails.imageUrl" // Kitabın resmi
        }
      }
    },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        nickName: { $first: "$nickName" },
        email: { $first: "$email" },
        imageUrl: { $first: "$imageUrl" },
        friends: { $first: "$friends" },
        books: { $push: "$bookDetails" },
        movies: { $first: "$movies" },
        series: { $first: "$series" },
        advertisements: { $first: "$advertisements" },
        rates: { $first: "$rates" }
      }
    },
    { $addFields: { books: { $slice: ["$books", 3] } } } // İlk 3 kitabı almak için $slice kullanılır
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
