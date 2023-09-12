const express = require('express');
const router = express.Router()
const commonValidator = require("../validators/common");
const directorService = require("../features/social/director/service");
const authService = require('../features/auth/login/handler');


//CREATE DIRECTOR
router.post('/directors', [
    commonValidator.imageUrlValidator,
    commonValidator.fullNameValidator,
],
    authService.authenticate,
    directorService.createDirector
);

//GET DIRECTORS LIST
router.get('/directors/:limit?/:page?', 
    authService.authenticate,
    directorService.listDirectors
);

module.exports = router;
