
const Book = require("../../../models/social/book");
const bookHandler = require("./handler");

const { validationResult } = require("express-validator");

exports.createBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(req.t("validation-failed"));
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
        const response = await bookHandler.createBook(BookObject, req.body.author, { bookExists: req.t("already-exists"), authorNotFound: "author-is-not-exists" });

        return res.status(201).json({ createdTime: response.createdAt, bookId: response.id });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
exports.listBooks = async (req, res, next) => {
    try {

        const limit = req.query.limit;
        const page = req.query.page
        const response = await bookHandler.getBooks(limit, page);
        return res.status(200).json(response);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.bookDetail = async (req, res, next) => {
    try {
        const bookId = req.params.id;

        const response = await bookHandler.findById(bookId, req.t("forbidden-book"));

        return res.status(200).json(response);

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
        const result = await bookHandler.readABook(bookId, userId, { forbiddenBook: req.t("forbidden-book"), forbiddenUser: req.t("forbidden-user"), alreadyRead: req.t("already-read-this-book") });
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
        const result = await bookHandler.removeReadBook(bookId, userId, { forbiddenBook: req.t("forbidden-book"), forbiddenUser: req.t("forbidden-user"), userDidNotRead: req.t("user-did-not-read-this-book") });
        return res.status(201).json();

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.listUserBooks = async (req, res, next) => {
    try {
        const limit = req.query.limit;
        const page = req.query.page
        var userId = req.params.id;
        if (!userId) {
            userId = req.user.user_id;

        }
        const response = await bookHandler.getUserBooks(limit, page, userId);
        return res.status(200).json(response);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
exports.commentToBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(req.t("validation-failed"));
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const bookId = req.params.bookId;
        const userId = req.user.user_id;
        const comment=req.body.comment;
        const result = await bookHandler.commentToBook(bookId, userId,comment, { forbiddenBook: req.t("forbidden-book"), forbiddenUser: req.t("forbidden-user") });
        return res.status(201).json();

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
