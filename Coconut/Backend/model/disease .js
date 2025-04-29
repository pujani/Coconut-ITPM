const mongoose = require('mongoose');

const disaseSchema = new mongoose.Schema({
    DName:{
        type: String
    },
    DImage:{
        type: String
    }
})

module.exports = disease = mongoose.model('disease', disaseSchema);