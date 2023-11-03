const { body } = require('express-validator');
const Consts=require("../consts/consts");

exports.descriptionValidator = body("description")
    .not().isEmpty()
    .withMessage((value, { req, location, path }) => {
        return req.t("valid-description-message");
    });

exports.prodTypeValidator = body("prodType")
    .not().isEmpty()
    .withMessage((value, { req, location, path }) => {
        return req.t("valid-prodType-message",{prodTypesList:Consts.PROD_TYPES.toString()});
    });

exports.prodIdValidator = body("prodId")
.not().isEmpty()
.withMessage((value, { req, location, path }) => {
    return req.t("valid-prodId-message");
});