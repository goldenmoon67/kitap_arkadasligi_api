const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new mongoose.Schema({


    name: {
        required: true,
        type: String
    },
    description: {
        type: String,
    },
    author: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Author' 
    },
    imageUrl: {
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
},{ timestamps: true });

module.exports = mongoose.model('Book', dataSchema)