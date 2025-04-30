const mongoose = require('mongoose');

const coconutSchema = new mongoose.Schema({
    CName:{
        type:String
    },
    CImage:{
        type:String
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "authuser",  
        required: true
    },
    CPrice:{
            type: Number
    },
    CNote:{
            type: String
    },
    CStatus:{
            type:String
    }
    
})

module.exports = coconut = mongoose.model('coconut', coconutSchema);