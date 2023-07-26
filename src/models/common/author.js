const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new mongoose.Schema({
    fullName: {
        required: true,
        type: String
    },
    books:{
        type: Array,
        default: [],
    },
    imageUrl: {
        type: String,
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

module.exports = mongoose.model('Author', dataSchema)