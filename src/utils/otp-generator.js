const { otpGen } = require('otp-gen-agent');

 require('dotenv').config();

const OTP_CONFIG  =  process.env.OTP_CONFIG;
const OTP_LENGTH  =  process.env.OTP_LENGTH;


module.exports.generateOTP = async () => {
  const OTP = await otpGen(); 
  return OTP;
};


