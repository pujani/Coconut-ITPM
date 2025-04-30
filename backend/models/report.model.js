const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  regionalDivision: { type: String, required: true },
  gramaNiladari: { type: String, required: true },
  addressLine1: String,
  landExtent: {
    value: Number,
    unit: { type: String, enum: ['Acres', 'Roods', 'Perches'] }
  },
  numberOfPlants: Number,
  trees: [{
    treeNumber: Number,
    age: { type: Number, enum: [1, 2] },
    symptoms: [Number],
    affected: Boolean
  }],
  incentiveAmount: Number,
  reportDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save hook for auto-generating unique ID
reportSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  const count = await mongoose.model('Report').countDocuments();
  this.uniqueId = `WD${String(count + 1).padStart(6, '0')}`;
  next();
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;