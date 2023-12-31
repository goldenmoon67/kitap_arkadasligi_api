const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const dataSchema = new mongoose.Schema({

    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    prodType: {
        required: true,
        type: String
    },
    prodId: {
        required: true,
        type: Schema.Types.ObjectId,

    },
    comments: {
        type: Array,
        default: [],
        ref: 'Comment'
    },
    acceptedPrivateConv: {
        type: Array,
        default:[],
        ref: 'User' 
    },
    privateComments: {
        type: Array,
        default: [],
        ref: 'Comment'
    },

}, { timestamps: true });
dataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Advertisement', dataSchema)