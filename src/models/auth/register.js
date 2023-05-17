const {mongoose} = require('mongoose');

const dataSchema = new mongoose.Schema({


    email: {
        required: true,
        type: String
    },

    createdTime: {
        type: String,
        default: new Date().toISOString(),
    },

    otpCode: {
        required: true,
        type: Number
    }
   
});


module.exports = mongoose.model('RegisterModel', dataSchema)