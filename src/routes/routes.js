const express = require('express');
const router = express.Router()
const registerService = require('../../src/features/auth/register/service');
const loginService = require('../../src/features/auth/login/service');
const userService = require('../../src/features/user/service');
const authService = require('../features/auth/login/handler');
const authValidator = require("../validators/auth");
const bookService = require("../../src/features/social/book/service");
const bookValidator = require("../validators/book");
const commonValidator = require("../validators/common");
const authorValidator = require("../validators/author");
const authorService = require("../features/social/author/service");
const userValidator = require("../validators/user");
//REGISTER
router.post('/register', [authValidator.emailValidator], registerService.sendRegisterMail);

//REGISTER 2
router.post('/verify-email', [
    authValidator.emailValidator,
    authValidator.otpCodeValidator,
    authValidator.passwordValidator,
],
    registerService.verifyEmail
);

//LOGIN
router.post('/login',
    [
        authValidator.emailValidator,
    ],
    loginService.login
);

//SESSION USER
router.get('/session-user', authService.authenticate, userService.getUser);

//GET USER{ID}
router.get('/users/:id', authService.authenticate, userService.getUser);

//PUT UPDATE PROFİLE
router.put('/update-profile',
    [
        userValidator.nickName,
    ],
    authService.authenticate, userService.updateProfile);

//CREATE AUTHOR
router.post('/authors', [
    commonValidator.imageUrlValidator,
    authorValidator.fullNameValidator,
],
    authService.authenticate,
    authorService.createAuthor
);

//CREATE BOOK
router.post('/books', [
    commonValidator.nameValidator,
    commonValidator.imageUrlValidator,
    bookValidator.categoryValidator,
    bookValidator.pageCountValidayor,
    bookValidator.authorValidator
],
    bookService.createBook
);

module.exports = router;
