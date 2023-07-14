const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({


    name: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String,
    },
    director: {
        required: true,
        type: String,
    },
    imageUrl: {
        required: true,
        type: String,
    },
    duration: {
        type: String,
            },
    categories: {
        type: Array,
        default: [],
    },
    readBy: {
        type: Array,
        default: [],
    },
   
    comments: {
        type: Array,
        default: [],
    },
    rates: {
        type: Number,
        default: 0,
    },
});


module.exports = mongoose.model('Movie', dataSchema)//TODO::this is not completed