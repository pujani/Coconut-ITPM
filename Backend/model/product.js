const mongoose = require('mongoose');

//coco
const productSchema = new mongoose.Schema({
    PName: {
        type: String,
        required: true,
    },
    PImage: {
        type: String,
        required: true
    },
    PPrice:{
        type: Number
    },
    PNote:{
        type: String
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "authuser",  
        required: true
    },
    PStatus:{
        type:String
    }
});

module.exports = product = mongoose.model('product', productSchema);
