const express = require('express');
const router = express.Router()
const commonValidator = require("../validators/common");
const authorService = require("../features/social/author/service");
const authService = require('../features/auth/login/handler');

//CREATE AUTHOR
router.post('/authors', [
    commonValidator.imageUrlValidator,
    commonValidator.fullNameValidator,
],
    authService.authenticate,
    authorService.createAuthor
);

//GET AUTHORS LIST
router.get('/authors/:limit?/:page?',
    authService.authenticate,
    authorService.listAuthors
);

//GET AUTHOR{ID}
router.get('/authors/:authorId',
    authService.authenticate,
    authorService.getAuthor,
)

module.exports = router;
