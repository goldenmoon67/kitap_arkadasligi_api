const Book= require("../../../models/social/book");


exports.createBook = async (BookObject) => {
    const isExisting=await this.findByName(BookObject.name);

    if(isExisting){
        const error = new Error("Already exist.");
        error.statusCode = 500;
        throw error;
    }
    const response= await Book.create(BookObject);
    return response;
};

exports.findByName = async (name) => {
    const book = await Book.findOne({
        name,
    });
    return book;
};

exports.findById = async (id) => {
    const book = await Book.findOne({
        id,
    });
    if (!book) {
        const error = new Error("Forbidden Resource.");
        error.statusCode = 500;
        throw error;
    }
    return book;
};

