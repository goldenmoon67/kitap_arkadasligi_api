const handler = require('./handler');


exports.sendRegisterMail = async (req, res) => {
    try {

        const isExisting = await handler.findUserByEmail(req.body.email);
        if (isExisting) {
            const error = new Error("Email already exists");
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


exports.verifyEmail = async (req, res) => {
    try {
        const { email, otpCode, password } = req.body;

        const registerModel = await handler.findRegisterModelByEmail(req.body.email);
        if (!registerModel) {
            const error = new Error("Email was not registered");
            error.statusCode = 403;
            throw error;
        }
        const isCodeTrue = otpCode === registerModel.otpCode;
        if (!isCodeTrue) {
            const error = new Error("Invalid OTP code");
            error.statusCode = 422;
            throw error;
        }

        const isPassed = (Math.abs(Date.now() - Date.parse(registerModel.createdTime)) / 1000 / 60) < 10 ? false : true;

        if (isPassed) {
            const otpGenerated = await handler.generateOTP();
            await handler.sendMail(email, otpGenerated);
            await handler.createUserRegisterModel(email, otpGenerated);
            const error = new Error("The OTP code has expired. We have sent a new email. Please check your inbox");
            error.statusCode = 422;
            throw error;
        }
        const response = await handler.createUser(email, password);

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