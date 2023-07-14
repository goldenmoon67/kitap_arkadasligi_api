const Book= require("../../../models/social/book");


exports.createBook = async (BookObject) => {
    const isExisting=this.findByName(BookObject.name);
    if(isExisting){
        return false
    }
    const response= await Book.create(BookObject);
    return response;
};

exports.findByName = async (name) => {
    const book = await Book.findOne({
        name,
    });
    if (!book) {
        return false;
    }
    return book;
};

//TODO::this is not completed