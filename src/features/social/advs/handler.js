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

exports.findById = async (id, errorMessage) => {
    const _id=new mongoose.Types.ObjectId(id );
    const advs = await Advs.aggregate([
        { $match: {_id } },
        {
            $lookup: {
                from: 'books', // İlişkilendirilecek koleksiyon
                localField: 'prodId', // Mevcut koleksiyondaki alan
                foreignField: '_id', // İlişkilendirilecek koleksiyondaki alan
                as: 'bookDetails' // Sonuçların ekleneceği alan
            }
        },
        { $unwind: { path: "$bookDetails", preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'users', // İlişkilendirilecek ikinci koleksiyon (kullanıcılar)
                localField: 'userId', // Mevcut koleksiyondaki alan
                foreignField: '_id', // İlişkilendirilecek koleksiyondaki alan
                as: 'userDetails' // Sonuçların ekleneceği alan
            }
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        
        {
            $project: {
                title: 1,
                description: 1,
                userId: 1,
                prodType: 1,
                prodId: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                bookDetails: {
                    id:"$bookDetails._id",
                    name: "$bookDetails.name",
                    imageUrl: "$bookDetails.imageUrl"
                },
                ownerDetail: {
                    userId: "$userDetails.userId",
                    name: "$userDetails.nickName",
                    imageUrl: "$userDetails.imageUrl"
                },
            }
        }
    ]).exec();

    if (!advs || advs.length === 0) {
        const error = new Error(errorMessage);
        error.statusCode = 500;
        throw error;
    }
    return advs[0];
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

