
const Director = require("../../../models/common/director");
const handler = require("./handler");
const { validationResult } = require("express-validator");

exports.createDirector = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const DirectorObject = new Director({
            fullName: req.body.fullName,
            imageUrl: req.body.imageUrl,
            
        });

        const response = await handler.createDirector(DirectorObject);
        return res.status(201).json({ createdTime: response.createdAt, directorId: response.id });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.listDirectors = async (req, res, next) => {
    try {
        
        const limit=req.query.limit;
        const page=req.query.page
        const response = await handler.getDirectors(limit,page);
        return res.status(200).json(response);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
