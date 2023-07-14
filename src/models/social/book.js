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
    author: {
        required: true,
        type: String,
    },
    imageUrl: {
        required: true,
        type: String,
    },
    pageCount: {
        required:true,
        type: Number,
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

//TODO::this is not completed
module.exports = mongoose.model('Book', dataSchema)