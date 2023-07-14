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
    seasons: {
        required: true,
        type: Object,
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


module.exports = mongoose.model('Series', dataSchema)//TODO::this is not completed