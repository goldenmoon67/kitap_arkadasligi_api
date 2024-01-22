const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const dataSchema = new mongoose.Schema({


    text: {
        required: true,
        type: String
    },
    ownerId: {
        required: true,
        type: String
    },
    prodId: {
        required: true,
        type:  mongoose.Types.ObjectId,
    },
    prodType: {
        required: true,
        type: String
    },
    rates: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });
dataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Comment', dataSchema)