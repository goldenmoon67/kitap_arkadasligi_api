const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    imageUrl: {
        type: String,
    },
    books: {
        type: Array,
        default: [],
        ref: 'Book' 
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
dataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', dataSchema)