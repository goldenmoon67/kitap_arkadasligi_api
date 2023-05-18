

const User = require('../../../models/user');
const RegisterModel = require('../../../models/auth/register');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const firebase=require("../../../utils/firebase-admin");
const htmlConsts=require("../../../consts/htmls");
const { otpGen } = require('otp-gen-agent');
require('dotenv').config();
const api_key = process.env.SENDGRID_API_KEY;
const transporter = nodemailer.createTransport(sendgridTransport(
    {
        auth: {
            api_key: api_key,
        }
    }
));



exports.createUser = async (email, password) => {
    const userResponse = await firebase.admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: false,
        disabled: false
    });
    if (!userResponse) {
        return res.send({ "message": "Unable to registered." });
    }
    const data = new User({
        userId: userResponse.uid,
        email: email,
    });
    const saveResponse = await data.save();
    if(saveResponse){
        const registerModel= await this.findRegisterModelByEmail(email);
        const deletedResponse=await RegisterModel.findByIdAndDelete(registerModel.id);
    }
    return saveResponse;
};



exports.findUserByEmail = async (email) => {
    const user = await User.findOne({
        email,
    });
    if (!user) {
        return false;
    }
    return user;
};

exports.findRegisterModelByEmail = async (email) => {
    const user = await RegisterModel.findOne({
        email,
    });
    if (!user) {
        return false;
    }
    return user;
};


exports.sendMail = async (email, otpCode) => {
    try {
        const response = await transporter.sendMail({
            to: email,
            from: "mirac@z2h.it",
            subject: "E-posta adresinizi doğrulayın",
            html: htmlConsts.VERIFYMAILHTML(otpCode),
        });

        console.log(response);

        return [200, "Email sent"];

    } catch (error) {
        return [400, error]
    }
};

exports.createUserRegisterModel = async (email, otpCode) => {
    const otpGenerated = otpCode;

    const isExisting = await this.findRegisterModelByEmail(email);
    if (isExisting) {
        const updatedUser =
            await isExisting.updateOne
                ({
                    email: email,
                    otpCode: otpGenerated,
                    createdTime: new Date().toISOString(),

                });
        if (!updatedUser) {
            return [false, 'Unable to sign you up'];
        }

        return [true, updatedUser];
    }
    const newUser = await RegisterModel.create({
        email: email,
        otpCode: otpGenerated,
    });
    if (!newUser) {
        return [false, 'Unable to sign you up'];
    }

    return [true, newUser];
};

exports.generateOTP = async () => {
    const OTP = await otpGen();
    return OTP;
};


