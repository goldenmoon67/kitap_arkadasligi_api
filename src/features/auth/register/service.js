const handler = require('./handler');


exports.sendRegisterMail = async (req, res) => {
    try {

        const isExisting = await handler.findUserByEmail(req.body.email);
        if (isExisting) {
            return res.send({ "message": "Email already exists" });
        }
        const otpGenerated = await handler.generateOTP();

        const newUser = await handler.createUserRegisterModel(req.body.email, otpGenerated);
        if (newUser[0]) {
            const emailResponse = await handler.sendMail(req.body.email, otpGenerated);
        }

        res.status(200).json({ "message": "Email Sent" });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

};


exports.verifyEmail = async (req, res) => {
    try {
        const { email, otpCode, password } = req.body;

        const registerModel = await handler.findRegisterModelByEmail(req.body.email);
        if (!registerModel) {
            return res.send({ "message": "Email was not registered" });
        }
        const isCodeTrue = otpCode === registerModel.otpCode;
        if (!isCodeTrue) {
            return res.send({ "message": "Invalid OTP code" });
        }

        const isPassed = (Math.abs(Date.now() - Date.parse(registerModel.createdTime)) / 1000 / 60) < 10 ? false : true;

        if (isPassed) {
            const otpGenerated = await handler.generateOTP();
            await handler.sendMail(email, otpGenerated);
            await handler.createUserRegisterModel(email,otpGenerated);
            return res.send({ "message": "The OTP code has expired. We have sent a new email. Please check your inbox" });
        }
        const response = await handler.createUser(email, password);

        return res.status(200).json({ "Response": response });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

}; 