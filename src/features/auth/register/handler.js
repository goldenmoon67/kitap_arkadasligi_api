

const User = require('../../../models/user');
const RegisterModel = require('../../../models/auth/register');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const firebase=require("../../../utils/firebase-admin");

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
            subject: "Succes",
            html: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>E-posta Doğrulama</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
            
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
            
                    .content {
                        background-color: #ffffff;
                        padding: 40px;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
            
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #888888;
                    }
            
                    .otp-code {
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                        padding: 20px;
                        background-color: #f0f0f0;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>E-posta Doğrulama</h1>
                    </div>
                    <div class="content">
                        <p>Merhaba,</p>
                        <p>Hesabınızı doğrulamak için aşağıdaki OTP (One-Time Password) kodunu kullanabilirsiniz:</p>
                        <div class="otp-code">${otpCode}</div>
                        <p>Bu kod sadece bir kez kullanılabilir ve 10 dakika boyunca geçerlidir.</p>
                        <p>İyi günler dileriz!</p>
                    </div>
                    <div class="footer">
                        <p>Bu bir otomatik e-posta mesajıdır, lütfen yanıtlamayınız.</p>
                    </div>
                </div>
            </body>
            </html>`
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


