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
},{ timestamps: true });


module.exports = mongoose.model('User', dataSchema)