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
        const response = await handler.createUser(email, password);

        return res.status(200).json({ "Response": response });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

}; 