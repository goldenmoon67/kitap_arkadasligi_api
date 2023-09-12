
const Author = require("../../../models/common/author");
const handler = require("./handler");
const { validationResult } = require("express-validator");

exports.createAuthor = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const AuthorObject = new Author({
            fullName: req.body.fullName,
            imageUrl: req.body.imageUrl,
            
        });

        const response = await handler.createAuthor(AuthorObject);
        return res.status(201).json({ createdTime: response.createdAt, authorId: response.id });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
exports.listAuthors = async (req, res, next) => {
    try {
        
        const limit=req.query.limit;
        const page=req.query.page
        const response = await handler.getAuthors(limit,page);
        return res.status(200).json(response);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getAuthor = async (req, res, next) => {
    try {
        
        const authorId=req.params.authorId;
        const response = await handler.findById(authorId);
        return res.status(200).json(response);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
