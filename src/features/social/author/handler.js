const Author= require("../../../models/common/author");


exports.createAuthor = async (AuthorObject) => {
    const isExisting=await this.findByName(AuthorObject.name);

    if(isExisting){
        const error = new Error("Already exist.");
        error.statusCode = 500;
        throw error;
    }
    const response= await Author.create(AuthorObject);
    return response;
};

exports.findByName = async (name) => {
    const author = await Author.findOne({
        name,
    });
    return author;
};

exports.findById = async (_id) => {

    const author = await Author.findOne({
        _id,
    });

    return author;
};

