const express = require('express');
const router = express.Router();
const authService = require('../features/auth/login/handler');
const commonValidator = require("../validators/common");
const bookValidator = require("../validators/book");
const bookService = require("../../src/features/social/book/service");


//CREATE BOOK
router.post('/books', [
    commonValidator.nameValidator,
    commonValidator.imageUrlValidator,
    bookValidator.categoryValidator,
    bookValidator.pageCountValidayor,
    bookValidator.authorValidator
],
    authService.authenticate,
    bookService.createBook
);

//GET BOOKS{id}
router.get('/books/:id',
    authService.authenticate,
    bookService.bookDetail
);

//READ BOOK
router.put('/books/:bookId/read',
    authService.authenticate,
    bookService.readABook
);

//REMOVE READ BOOK
router.put('/books/:bookId/unread',
    authService.authenticate,
    bookService.removeReadBook
);


//GET BOOKS LIST
router.get('/books/:limit?/:page?',
    authService.authenticate,
    bookService.listBooks
);

//GET MY BOOK LIST
router.get('/users/my-books',
    authService.authenticate,
    bookService.listUserBooks
);

//GET USER {userId} BOOK LIST
router.get('/users/:userId/books',
    authService.authenticate,
    bookService.listUserBooks
);

//PUT COMMENT TO BOOK
router.put('/books/:bookId/comment',[
    commonValidator.commentTextValidator,

],
    authService.authenticate,
    bookService.commentToBook
);





module.exports = router;