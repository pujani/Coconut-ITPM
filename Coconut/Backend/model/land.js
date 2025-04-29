const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
    Landsize:{
        type: String
    },
    Coconuttype:{
        type: String
    }
})

module.exports = land = mongoose.model('land', landSchema);
