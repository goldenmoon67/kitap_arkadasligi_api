const Book = require("../../../models/social/book");
const userhandler = require("../../user/handler");
const authorHandler = require("../author/handler");
const Consts = require("../../../consts/consts");
const commentHandler = require("../../social/comment/handler");
const User = require("../../../models/user")
const mongoose = require('mongoose');

exports.createBook = async (BookObject, authorId, errorMessagesObject) => {
    const isExisting = await this.findByName(BookObject.name);

    if (isExisting) {
        const error = new Error(errorMessagesObject.bookExists);
        error.statusCode = 500;
        throw error;
    }
    const author = await authorHandler.findById(authorId);
    if (!author) {
        const error = new Error(errorMessagesObject.authorNotFound);
        error.statusCode = 422;
        throw error;
    }
    const response = await Book.create(BookObject);
    author.books.push(response._id);
    author.save();
    return response;
};

exports.findByName = async (name) => {
    const book = await Book.findOne({
        name,
    });
    return book;
};
exports.findByIdBasic = async (_id) => {
    const book = await Book.findOne({
        _id,
    });
    return book;
};
exports.findById = async (userId,_id, errorMessage) => {
        
    const book = await Book.aggregate([
        { $match: { _id:new mongoose.Types.ObjectId(_id) } },
        {
            $addFields: {
                isReadByUser: {
                    $in: [userId, "$readBy"]
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'readBy',
                foreignField: 'userId',
                as: 'readByUsers'
            }
        },
        {
            $lookup: {
                from: 'authors',
                localField: 'author',
                foreignField: '_id',
                as: 'authorDetails'
            }
        },
        {
            $unwind: "$authorDetails"
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'comments',
                foreignField: '_id',
                as: 'commentDetails'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'commentDetails.ownerId',
                foreignField: 'userId',
                as: 'commentOwnerDetails'
            }
        },
      
        {
            $project: {
                // Kitap detayları
                name: 1,
                description: 1,
                pageCount: 1,
                categories: 1,
                orginalName: 1,
                rates: 1,
                createdAt: 1,
                updatedAt: 1,
                isReadByUser:1,
                imageUrl:1,
                __v: 1,
                // Kullanıcı detayları
                readByUsers: {
                    $map: {
                        input: "$readByUsers",
                        as: "user",
                        in: { userId: "$$user.userId", name: "$$user.nickName", imageUrl: "$$user.imageUrl" }
                    }
                },
                // Yazar detayları
                author: {
                    _id: "$authorDetails._id",
                    name: "$authorDetails.fullName",
                    imageUrl: "$authorDetails.imageUrl"
                },
                // Yorum detayları
                commentDetails: {
                    $map: {
                        input: "$commentDetails",
                        as: "comment",
                        in: {
                            id: "$$comment._id",
                            text: "$$comment.text",
                            prodType:"$$comment.prodType",
                            prodId:"$$comment.prodId",
                            // other fields...
                            ownerDetails: {
                                $let: {
                                    vars: {
                                        ownerDetail: { $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$commentOwnerDetails",
                                                    as: "owner",
                                                    cond: { $eq: ["$$owner.userId", "$$comment.ownerId"] }
                                                }
                                            }, 0
                                        ]}
                                    },
                                    in: {
                                        userId: "$$ownerDetail.userId",
                                        name: "$$ownerDetail.nickName", // Kullanıcı adı alanınızın adı
                                        imageUrl: "$$ownerDetail.imageUrl"
                                    }
                                }
                            }
                            
                            // Assuming ownerId maps to userId in your schema
                            // other fields...
                        }
                    }
                }
            }
        }
    ]);
    if (!book) {
        const error = new Error(errorMessage);
        error.statusCode = 500;
        throw error;
    }
    return book[0];
};

exports.readABook = async (bookId, userId, errorMessagesObject) => {
    const book = await this.findByIdBasic(bookId);

    const user = await userhandler.findUserByIDBasic(userId);
    if (!book) {
        const error = new Error(errorMessagesObject.forbiddenBook);
        error.statusCode = 500;
        throw error;
    }

    if (!user) {
        const error = new Error(errorMessagesObject.forbiddenUser);
        error.statusCode = 500;
        throw error;
    }

    const wasRead = book.readBy.includes(userId);
    if (wasRead) {
        const error = new Error(errorMessagesObject.alreadyRead);
        error.statusCode = 403;
        throw error;
    }
    book.readBy.push(userId);
    await book.save();
    user.books.push(new mongoose.Types.ObjectId(bookId));
    await user.save();

};

exports.removeReadBook = async (bookId, userId, errorMessagesObject) => {
    const book = await this.findByIdBasic(bookId);

    const user = await userhandler.findUserByIDBasic(userId);

    if (!book) {
        const error = new Error(errorMessagesObject.forbiddenBook);
        error.statusCode = 500;
        throw error;
    }

    if (!user) {
        const error = new Error(errorMessagesObject.forbiddenUser);
        error.statusCode = 500;
        throw error;
    }

    const wasRead = book.readBy.includes(userId);
    if (!wasRead) {
        const error = new Error(errorMessagesObject.userDidNotRead);
        error.statusCode = 403;
        throw error;
    }
    book.readBy.pull(userId)
    await book.save();
    user.books.pull(new mongoose.Types.ObjectId(bookId));
    await user.save();

};


exports.getBooks = async (limit, page) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
       
        // Yeni eklenen projection
        select: '_id name imageUrl', // Buraya kitabın kendi imageUrl'ini eklemeniz gerekiyor.
        projection: { // Kitap ve yazar detaylarını projekte etme
            _id: 1,
            name: 1,
            imageUrl: 1, // Kitabın kendi resmi
           
        },
        $group: {
            id: "$_id",
            name: "$name",
            imageUrl: "$imageUrl"
        }

    };

    const response = await Book.paginate({}, options);
    const books = response.docs.map(book => {
        return {
            id: book._id, // _id'yi id olarak değiştir
            name: book.name,
            imageUrl: book.imageUrl,
            // Buraya diğer istediğiniz alanları ekleyebilirsiniz.
        };
    });

    // Yapıyı orijinal paginate cevabına benzetecek şekilde ayarla
    return {
        ...response,
        docs: books
    };
};


exports.getUserBooks = async (limit, page, userId) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
        populate: [{
            path: "author",
            select: "fullName imageUrl"
        }],
    };

    const response = await Book.paginate({ "readBy": userId }, options);
    return response;
};

exports.commentToBook = async (bookId, userId, comment, errorMessagesObject) => {
    const book = await this.findByIdBasic(bookId);

    const user = await userhandler.findUserByIDBasic(userId);

    if (!book) {
        const error = new Error(errorMessagesObject.forbiddenBook);
        error.statusCode = 500;
        throw error;
    }

    if (!user) {
        const error = new Error(errorMessagesObject.forbiddenUser);
        error.statusCode = 500;
        throw error;
    }

    const createdComment = await commentHandler.createComment(comment, userId, bookId, "book", errorMessagesObject.forbiddenUser);

    book.comments.push(createdComment._id);
    await book.save();

    const userNew = await User.findOne({ userId: userId });
    userNew.comments.push(new mongoose.Types.ObjectId(createdComment._id));
    await userNew.save();


};

exports.createBookForDBConvert = async (BookObject, authorName) => {
    const isExisting = await this.findByName(BookObject.name);

    if (isExisting) {
        return null;
    }
    const authorResponse = await authorHandler.createAuthorForDB(authorName);
    const author = await authorHandler.findById(authorResponse.id);
    BookObject.author = authorResponse.id;
    const response = await Book.create(BookObject);
    author.books.push(response._id);
    author.save();
    return response;
};