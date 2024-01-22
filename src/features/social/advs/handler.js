const Advs = require("../../../models/social/advertisement");
const userHandler = require("../../user/handler");
const Consts = require("../../../consts/consts");
const prodHelper = require("../../../utils/prod-helper");
const mongoose = require('mongoose');

exports.createAdvs = async (title, description, userId, prodType, prodId, errorMessages) => {
    const user = await userHandler.findUserByIDBasic(userId);
    if (!user) {
        const error = new Error(errorMessages.forbiddenUser);
        error.statusCode = 500;
        throw error;
    }
    await prodHelper.checkProdTypeIsExists(prodType, prodId, {
        unExpectedValue: errorMessages.unExpectedValue,
        bookNotExistsMessage: errorMessages.bookNotExistsMessage
    });
    const response = await Advs.create({ title: title, description: description, userId: user._id, prodId: prodId, prodType: prodType });
    user.advertisements.push(new mongoose.Types.ObjectId(response._id));
    await user.save();
    return response;
};

exports.findById = async (_id, errorMessage) => {

    const advs = await Advs.findOne({
        _id,
    });

    if (!advs) {
        const error = new Error(errorMessage);
        error.statusCode = 500;
        throw error;
    }
    return advs;
};

exports.getAdvses = async (limit, page) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
    };

    const response = await Advs.paginate({}, options);
    return response;
};
exports.requestPrivateConv = async (userId, advsId) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
    };

    const response = await Advs.paginate({}, options);
    return response;
};

