const mongoose = require('mongoose');

const messegeSchema = new mongoose.Schema({
    MContent: { type: String, required: true },
    Muser: { type: mongoose.Schema.Types.ObjectId, ref: 'authuser', required: true },
    MRecipient: { type: mongoose.Schema.Types.ObjectId, ref: 'authuser' },
    MIsPrivate: { type: Boolean, default: false },
    McreatedAt: { type: Date, default: Date.now },
    MdeletedAt: { type: Date }
});

module.exports = messega = mongoose.model('messega', messegeSchema);