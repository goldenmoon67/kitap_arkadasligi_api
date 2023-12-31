const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const dataSchema = new mongoose.Schema({

    title: {
        required: true,
        type: String
    },
    message: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    notificationType: {
        required: true,
        type: String
    },
    prodId: {
        required: true,
        type: Schema.Types.ObjectId,

    },
    senderUserId: {
        required: true,
        type: String,
    },
}, { timestamps: true });
dataSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Notification', dataSchema)