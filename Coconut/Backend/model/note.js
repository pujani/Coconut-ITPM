const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    NName:{
        type: String
    },
    NImage:{
        type: String
    },
    NNote:{
        type: String
    }
})

module.exports = note = mongoose.model('note', noteSchema)