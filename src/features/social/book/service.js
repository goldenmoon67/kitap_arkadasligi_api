
const Book = require("../../../models/social/book");
const handler = require("./handler");
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

        const response = await handler.createBook(BookObject);
        return res.status(201).json({ createdTime: response.createdAt, bookId: response.id });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
