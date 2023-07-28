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
    const book = await Author.findOne({
        name,
    });
    return book;
};

exports.findById = async (id) => {
    const book = await Author.findOne({
        id,
    });
    if (!book) {
        const error = new Error("Forbidden Resource.");
        error.statusCode = 500;
        throw error;
    }
    return book;
};

