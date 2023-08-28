const Book = require("../../../models/social/book");
const userhandler = require("../../user/handler");
const authorHandler = require("../author/handler");
const Consts=require("../../../consts/consts");

exports.createBook = async (BookObject,authorId) => {
    const isExisting = await this.findByName(BookObject.name);

    if (isExisting) {
        const error = new Error("Already exist.");
        error.statusCode = 500;
        throw error;
    }
    const author = await authorHandler.findById(authorId);
    if (!author) {
        const error = new Error("Author is not exists");
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

exports.findById = async (_id) => {

    const book = await Book.findById({
        _id,
    }).populate("author")
    ;
    if (!book) {
        const error = new Error("Forbidden Resource book.");
        error.statusCode = 500;
        throw error;
    }
    return book;
};

exports.readABook = async (bookId, userId) => {
    const book = await this.findById(bookId);

    const user = await userhandler.findUserByID(userId);

    if (!book) {
        const error = new Error("Forbidden Resource Book.");
        error.statusCode = 500;
        throw error;
    }

    if (!user) {
        const error = new Error("Forbidden Resource User.");
        error.statusCode = 500;
        throw error;
    }

    const wasRead=book.readBy.includes(userId);         
    if(wasRead){
        const error = new Error("This book already read by this user");
        error.statusCode = 403;
        throw error;
    }
    book.readBy.push(userId);
    await book.save();
    user.books.push(bookId);
    await user.save();

};

exports.removeReadBook = async (bookId, userId) => {
    const book = await this.findById(bookId);

    const user = await userhandler.findUserByID(userId);

    if (!book) {
        const error = new Error("Forbidden Resource Book.");
        error.statusCode = 500;
        throw error;
    }

    if (!user) {
        const error = new Error("Forbidden Resource User.");
        error.statusCode = 500;
        throw error;
    }

    const wasRead=book.readBy.includes(userId);         
    if(!wasRead){
        const error = new Error("This user did not read this book");
        error.statusCode = 403;
        throw error;
    }
    book.readBy.pull(userId)
    await book.save();
    user.books.pull(bookId);
    await user.save();

};


exports.getBooks = async (limit,page) => {const options = {
    page: page||1,
    limit: limit||Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
  };
  
 const response= await Book.paginate({},options);
return response;
};
