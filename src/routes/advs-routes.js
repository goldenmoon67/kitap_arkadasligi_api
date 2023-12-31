const express = require('express');
const router = express.Router();
const advsValidator = require("../validators/advs");
const advsService = require("../features/social/advs/service");
const authService=require('../features/auth/login/handler');

router.post('/advs', [
    advsValidator.descriptionValidator,
    advsValidator.prodTypeValidator,
    advsValidator.prodIdValidator
],
authService.authenticate,
  advsService.createAuthor
);

router.get('/advs',
authService.authenticate,
advsService.listAdvses
);

router.get('/advs/:id',
authService.authenticate,
advsService.advsDetail
);
module.exports = router;
