const Consts = require("../consts/consts");
const bookHandler = require("../features/social/book/handler");
const mongoose = require('mongoose');

exports.checkProdTypeIsExists = async (prodType, prodId, messagesObjects) => {
    const isExisting = Consts.PROD_TYPES.includes(prodType);
    if (!isExisting) {
        const error = new Error(messagesObjects.unExpectedValue);
        error.statusCode = 500;
        throw error;
    }
    if (prodType == "book") {
        const isExisting = await bookHandler.findByIdBasic(new mongoose.Types.ObjectId(prodId));
        if (!isExisting) {
            const error = new Error(messagesObjects.bookNotExistsMessage);
            error.statusCode = 500;
            throw error;
        }
    } else {
        const error = new Error(messagesObjects.unExpectedValue);
        error.statusCode = 500;
        throw error;
    }
}

exports.generateTitleForProd = async (prodType, prodId, messagesObjects) => {
    const isExisting = Consts.PROD_TYPES.includes(prodType);
    if (!isExisting) {
        const error = new Error(messagesObjects.unExpectedValue);
        error.statusCode = 500;
        throw error;
    }
    if (prodType == "book") {
        const isExisting = await bookHandler.findByIdBasic(prodId);
        if (!isExisting) {
            const error = new Error(messagesObjects.bookNotExistsMessage);
            error.statusCode = 500;
            throw error;
        }
        return isExisting.name;
    } else if (prodType == "movie") {
        //const isExisting = await bookHandler.findById(prodId);
        if (!isExisting) {
            const error = new Error(messagesObjects.bookNotExistsMessage);
            error.statusCode = 500;
            throw error;
        }
        return   isExisting.name;
    } else if (prodType == "series") {
        //const isExisting = await bookHandler.findById(prodId);
        if (!isExisting) {
            const error = new Error(messagesObjects.bookNotExistsMessage);
            error.statusCode = 500;
            throw error;
        }
        return   isExisting.name;
    } else {
        const error = new Error(messagesObjects.unExpectedValue);
        error.statusCode = 500;
        throw error;
    }
}