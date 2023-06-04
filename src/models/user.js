const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

    userId: {
        required: true,
        type: String
    },

    email: {
        required: true,
        type: String
    }
   
});


module.exports = mongoose.model('User', dataSchema)