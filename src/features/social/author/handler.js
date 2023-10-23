const Author = require("../../../models/common/author");
const Consts = require("../../../consts/consts");


exports.createAuthor = async (AuthorObject,errorMessage) => {
    const isExisting = await this.findByName(AuthorObject.fullName);

    if (isExisting) {
        const error = new Error(errorMessage);
        error.statusCode = 500;
        throw error;
    }
    const response = await Author.create(AuthorObject);
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