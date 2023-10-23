const handler = require('./handler');
const {  validationResult } = require("express-validator");


exports.sendRegisterMail = async  (req, res,next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error =  new Error(req.t("validation-failed"));
            error.statusCode=422;
            error.data=errors.array();
            throw error;
        }
        const isExisting = await handler.findUserByEmail(req.body.email);
        if (isExisting) {
            const error = new Error(req.t( "email-already-exists"));
            error.statusCode = 422;
            throw error;
        }
        const otpGenerated = await handler.generateOTP();

        const newUser = await handler.createUserRegisterModel(req.body.email, otpGenerated);
        if (newUser[0]) {
            const emailResponse = await handler.sendMail(req.body.email, otpGenerated);
        }

        res.status(201).json();

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};


exports.verifyEmail = async  (req, res,next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error =  new Error(req.t("validation-failed"));
            error.statusCode=422;
            error.data=errors.array();
            throw error;
        }
        const { email, otpCode, password } = req.body;

        const registerModel = await handler.findRegisterModelByEmail(req.body.email);
        if (!registerModel) {
            const error = new Error(req.t( "email-was-not-registered"));
            error.statusCode = 403;
            throw error;
        }
        const isCodeTrue = otpCode === registerModel.otpCode;
        if (!isCodeTrue) {
            const error = new Error(req.t( "invalid-OTP-code"));
            error.statusCode = 422;
            throw error;
        }

        const isPassed = (Math.abs(Date.now() - Date.parse(registerModel.createdTime)) / 1000 / 60) < 10 ? false : true;

        if (isPassed) {
            const otpGenerated = await handler.generateOTP();
            await handler.sendMail(email, otpGenerated);
            await handler.createUserRegisterModel(email, otpGenerated,req.t( "unable-to-sign-up"));
            const error = new Error(req.t("otp-code-expired"));
            error.statusCode = 422;
            throw error;
        }
        const response = await handler.createUser(email, password,req.t("unable-to-registered"));

        return res.status(201).json({
            userId: response.userId,
            createdTime: response.createdTime,
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}; 


exports.resetPassword = async  (req, res,next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error =  new Error(req.t("validation-failed"));
            error.statusCode=422;
            error.data=errors.array();
            throw error;
        }
        const isExisting = await handler.findUserByEmail(req.body.email);
        if (!isExisting) {
            const error = new Error(req.t("email-does-not-found"));
            error.statusCode = 422;
            throw error;
        }
        const otpGenerated = await handler.generateOTP();
        const newUser = await handler.createUserRegisterModel(req.body.email, otpGenerated,req.t( "unable-to-sign-up"));
        if (!newUser[0]) {
            const error = new Error(req.t( "otp-can-not-generated"));
            error.statusCode = 422;
            throw error;
        }
        const htmlBodyObject={
            h1:req.t("verify-email-html-body-header-h1"), 
            contentP1:req.t("erify-email-html-body-content-p1"),
            contentP2:req.t("erify-email-html-body-content-p2"), 
            contentP3:req.t("verify-email-html-body-content-p3"),
            contentP4:req.t("verify-email-html-body-content-p4"), 
            footer:req.t("verify-email-html-body-footer-p")
        };
        const emailResponse = await handler.sendMail(req.body.email, otpGenerated,req.t("verify-email-subject-message"),htmlBodyObject);

        return res.status(201).json({
            createdTime: emailResponse.createdTime,
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}; 