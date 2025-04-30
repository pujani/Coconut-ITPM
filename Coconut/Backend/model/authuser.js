const mongoose = require('mongoose');

const authuserSchema = new mongoose.Schema({
    UName:{
        type: String,
        required: true
    },
    UEmail: {
        type: String,
        required: true,
        unique: true
    },
    Uaddress: {
        type: String,
        required: true
    },
    Upassword: {
        type: String,
        required: true
    },
    Urole: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }

})

module.exports = authuser = mongoose.model('authuser', authuserSchema)