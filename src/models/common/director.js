const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new mongoose.Schema({


    fullName: {
        required: true,
        type: String
    },
    movies:{
        type: Array,
        default: [],
    },
    series:{
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

module.exports = mongoose.model('Director', dataSchema)