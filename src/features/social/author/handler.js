const Author= require("../../../models/common/author");


exports.createAuthor = async (AuthorObject) => {
    const isExisting=await this.findByName(AuthorObject.fullName);

    if(isExisting){
        const error = new Error("Already exist.");
        error.statusCode = 500;
        throw error;
    }
    const response= await Author.create(AuthorObject);
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

