
const Book = require("../../../models/social/book");
const bookHandler = require("./handler");

const { validationResult } = require("express-validator");

exports.createBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const BookObject = new Book({
            name: req.body.name,
            description: req.body.description,
            author: req.body.author,
            categories: req.body.categories,
            imageUrl: req.body.imageUrl,
            pageCount: req.body.pageCount,

        });
        const response = await bookHandler.createBook(BookObject,req.body.author);
    
        return res.status(201).json({ createdTime: response.createdAt, bookId: response.id });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};


exports.readABook = async (req, res, next) => {
    try {
        
        const bookId = req.params.bookId;
        const userId = req.user.user_id;
        const result=  await bookHandler.readABook(bookId, userId);
        return res.status(201).json();

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.removeReadBook = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;
        const userId = req.user.user_id;
        const result=  await bookHandler.removeReadBook(bookId, userId);
        return res.status(201).json();

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
