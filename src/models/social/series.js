const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    director: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Director'
    },
    categories: {
        type: Array,
        default: [],
    },
    watchedBy: {
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


module.exports = mongoose.model('Series', dataSchema)