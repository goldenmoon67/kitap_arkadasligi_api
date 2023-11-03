const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const dataSchema = new mongoose.Schema({


    text: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: String
    },
    rates: {
        type: Number,
        default: 0,
    },

},{ timestamps: true });
dataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Comment', dataSchema)