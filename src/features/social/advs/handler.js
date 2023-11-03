const Advs = require("../../../models/social/advertisement");
const userHandler=require("../../user/handler");
const Consts = require("../../../consts/consts");
const prodHelper=require("../../../utils/prod-helper");

exports.createAdvs = async (title,description,userId,prodType,prodId,errorMessages) => {
    console.log(userId)
    const user=await userHandler.findUserByID(userId);
    if (!user) {
        const error = new Error(errorMessages.forbiddenUser);
        error.statusCode = 500;
        throw error;
    }
    await prodHelper.checkProdTypeIsExists(prodType,prodId, {
        unExpectedValue:errorMessages.unExpectedValue,
        bookNotExistsMessage:errorMessages.bookNotExistsMessage});
    const response = await Advs.create({title:title, description:description,userId:user._id,prodId:prodId,prodType:prodType});
    return response;
};

exports.findByName = async (fullName) => {
    const author = await Author.findOne({
        fullName,
    });
    return author;
};

exports.findById = async (_id) => {

    const author = await Author.findOne({
        _id,
    });

    return author;
};

exports.getAuthors = async (limit, page) => {
    const options = {
        page: page || 1,
        limit: limit || Consts.DEFAULT_PAGING_ELEMENT_LIMIT,
    };

    const response = await Author.paginate({}, options);
    return response;
};

exports.createAuthorForDB = async (authorName, imageUrl, description) => {
    const isExisting = await this.findByName(authorName);

    if (isExisting) {
        return isExisting;
    }
    const response = await Author.create({ fullName: authorName, imageUrl: imageUrl, description: description });
    return response;
};