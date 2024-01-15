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

exports.findById = async (_id, errorMessage) => {

    const book = await Book.findById({
        _id,
    }).populate({
        path: "author",
        select: "fullName imageUrl"
    })

    if (!book) {
        const error = new Error(errorMessage);
        error.statusCode = 500;
        throw error;
    }
    return book;
};

exports.readABook = async (bookId, userId, errorMessagesObject) => {
    const book = await this.findById(bookId, errorMessagesObject.forbiddenBook);

    const user = await userhandler.findUserByID(userId);
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
    const userNew = await User.findOne({ userId: userId });
    userNew.books.push(new mongoose.Types.ObjectId(bookId));
    await userNew.save();

};

exports.removeReadBook = async (bookId, userId, errorMessagesObject) => {
    const book = await this.findById(bookId, errorMessagesObject.forbiddenBook);

    const user = await userhandler.findUserByID(userId);

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
    user.books.pull(bookId);
    await user.save();

};


exports.getBooks = async (limit, page) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
        populate: [{
            path: "author",
            select: "fullName imageUrl"
        }],
        select: '_id name pageCount categories readBy comments rates orginalName',


    };

    const response = await Book.paginate({}, options);
    return response;
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
    const book = await this.findById(bookId, errorMessagesObject.forbiddenBook);

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