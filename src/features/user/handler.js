const User = require('../../models/user');
const Consts = require("../../consts/consts");
const { default: mongoose } = require('mongoose');


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
    { $sort: { "bookDetails.someField": 1 } },

    {
      $lookup: {
        from: 'comments',
        localField: 'comments',
        foreignField: '_id',
        as: 'commentDetails'
      }
    },
    { $unwind: "$commentDetails" },
    {
      $lookup: {
        from: 'books',
        localField: 'commentDetails.prodId',
        foreignField: '_id',
        as: 'relatedBookDetails'
      }
    },
    { $unwind: { path: "$relatedBookDetails", preserveNullAndEmptyArrays: true } },
    // Yeni eklenen kısım: advertisements için lookup
    {
      $lookup: {
        from: 'advertisements',
        localField: 'advertisements',
        foreignField: '_id',
        as: 'advertisementDetails'
      }
    },
    { $unwind: "$advertisementDetails" },

    // Reklamlardaki her ürün için kitap detayları çekme
    {
      $lookup: {
        from: 'books',
        localField: 'advertisementDetails.prodId',
        foreignField: '_id',
        as: 'advertisementBookDetails'
      }
    },
    { $unwind: { path: "$advertisementBookDetails", preserveNullAndEmptyArrays: true } },

    {
      $project: {
        userId: 1,
        nickName: 1,
        email: 1,
        imageUrl: 1,
        friends: 1,
        movies: 1,
        series: 1,
        rates: 1,
        bookDetails: {
          id: "$bookDetails._id",
          name: "$bookDetails.name", 
          imageUrl: "$bookDetails.imageUrl" 
        },
        commentDetails: {
          id: "$commentDetails._id",
          text: "$commentDetails.text",
          prodType: "$commentDetails.prodType",
          prodId: "$commentDetails.prodId",
          ownerId: "$commentDetails.ownerId",
          relatedBook: {
            id: "$relatedBookDetails._id",
            name: "$relatedBookDetails.name",
            imageUrl: "$relatedBookDetails.imageUrl"
          }
        },
        // Reklamların detayları
        advertisementDetails: {
          id: "$advertisementDetails._id",
          title: "$advertisementDetails.title",
          description: "$advertisementDetails.description",
          prodId: "$advertisementDetails.prodId",
          prodType: "$advertisementDetails.prodType",
          bookImageUrl: "$advertisementBookDetails.imageUrl" // Kitabın imageUrl'ini ekleme
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
        comments: { $push: "$commentDetails" },
        movies: { $first: "$movies" },
        series: { $first: "$series" },
        advertisements: { $push: "$advertisementDetails" },
        rates: { $first: "$rates" }
      }
    },
    { $addFields: { books: { $slice: ["$books", 3] }, comments: { $slice: ["$comments", 3] }, advertisements: { $slice: ["$advertisements", 3] } } }
  ]);

  console.log(user);
  if (!user) {
    return false;
  }
  return user[0];
};

exports.findUserByIDBasic = async (userId) => {
  const user = await User.findOne({userId});

  console.log(user);
  if (!user) {
    return false;
  }
  return user;
};
exports.updateUser = async (updatedData, errorMessage) => {
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
    nickName: { $regex: nickName.toString(), "$options": "i" }
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
