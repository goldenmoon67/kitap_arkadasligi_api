const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

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
dataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Author', dataSchema)