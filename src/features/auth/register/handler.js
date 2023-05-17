

const User = require('../../../models/user');
const  RegisterModel  = require('../../../models/auth/register');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
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
            subject: "Succes",
            html: `<h1>${otpCode}</h1>`
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


