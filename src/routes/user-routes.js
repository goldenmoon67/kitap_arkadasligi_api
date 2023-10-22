const express = require('express');
const router = express.Router();
const authService = require('../features/auth/login/handler');
const userService = require('../../src/features/user/service');
const userValidator = require("../validators/user");

//SESSION USER
router.get('/session-user', authService.authenticate, userService.getUser);

//GET USER{ID}
router.get('/users/:id', authService.authenticate, userService.getUser);

//PUT UPDATE PROFİLE
router.put('/update-profile',
    [
        userValidator.nickName,
    ],
    authService.authenticate, userService.updateProfile
    );


//GET USERS LIST
router.get('/users/:limit?/:page?',
    authService.authenticate,
    userService.listUsers
);


module.exports = router;
