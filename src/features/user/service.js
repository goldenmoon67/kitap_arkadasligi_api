const userHandler = require('./handler');
const User=require("../../models/user");
const { validationResult } = require("express-validator");


exports.getUser = async (req, res, next) => {
    try {
        var userId = req.params.id;
        if (!userId) {
            userId = req.user.user_id;

        }
        const response = await userHandler.findUserByID(userId);
        return res.status(201).json({
            userId: response.userId,
            nickName: response.nickName,
            email: response.email,
            friends: response.friends,
            books: response.books,
            movies: response.movies,
            series: response.series,
            advertisements: response.advertisements,
            rates: response.rates,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

};


exports.updateProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const updatedData=req.body;
        const  userId = req.user.user_id;       
        updatedData.userId=userId;
        const response = await userHandler.updateUser(updatedData);
        return res.status(201).json({ createdTime: response.createdAt, userId: response.userId });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

};