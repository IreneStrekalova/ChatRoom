const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    createDate:{
        type: Date
    },
    updateDate:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', schema);