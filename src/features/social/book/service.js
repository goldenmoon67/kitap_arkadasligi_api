
const Book = require("../../../models/social/book");
const handler = require("./handler");

exports.createBook = async (req, res) => {
    try {
        const BookObject = {
            name: req.body.name,
            description: req.body.description,
            author: req.body.author,
            imageUrl: req.body.imageUrl,
            pageCount: req.body.pageCount,
            categories: req.body.categories,
        }
        const response = await handler.createBook(BookObject);

        if (response == false) {
            const error = new Error("Already existing");
            error.statusCode = 401;
            throw error;
        }


        return res.status(201).json({ createdTime: new Date().toISOString() });


    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}; 
//TODO::this is not completed