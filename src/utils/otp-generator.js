const { otpGen } = require('otp-gen-agent');

module.exports.generateOTP = async () => {
  const OTP = await otpGen(); 
  return OTP;
};


