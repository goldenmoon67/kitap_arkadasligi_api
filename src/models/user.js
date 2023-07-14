const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

    userId: {
        required: true,
        type: String
    },

    email: {
        required: true,
        type: String
    },
    nickName: {
        type: String,
    },
    createdTime: {
        type: String,
        default: new Date().toISOString(),
    },
    books: {
        type: Array,
        default: [],
    },
    movies: {
        type: Array,
        default: [],
    },
    series: {
        type: Array,
        default: [],
    },
    friends: {
        type: Array,
        default: [],
    },
   
    advertisements: {
        type: Array,
        default: [],
    },
    rates: {
        type: Number,
        default: 0,
    },
});


module.exports = mongoose.model('User', dataSchema)