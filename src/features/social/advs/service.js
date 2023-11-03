
const Advs = require("../../../models/social/advertisement");
const handler = require("./handler");
const { validationResult } = require("express-validator");
const prodHelper = require("../../../utils/prod-helper");

exports.createAuthor = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(req.t("validation-failed"));
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const prodFeatures =await prodHelper.generateTitleForProd(req.body.prodType, req.body.prodId, {
            unExpectedValue: req.t("un-expected-value-for-prod-type"),
            bookNotExistsMessage: req.t("forbidden-book"),
        });
        const advsTitle=req.t(prodFeatures.translKey,{bookName:prodFeatures.prodName});
        const response = await handler.createAdvs(
            advsTitle,
            req.body.description,
            req.user.uid,
            req.body.prodType,
            req.body.prodId, {
            forbiddenUser: req.t("forbidden-user"),
            unExpectedValue: req.t("un-expected-value-for-prod-type"),
            bookNotExistsMessage: req.t("forbidden-book"),
        });
        return res.status(201).json({ createdTime: response.createdAt, authorId: response.id });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};