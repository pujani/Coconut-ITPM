const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  extent: { type: Number, required: true },
  extentUnit: { type: String, required: true },
  numberOfPlants: { type: Number, required: true },
  numberOfPlantsAffected: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  photos: { type: [String], required: true },
  percentageAffected: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  userId: { type: String, required: true }
}, { timestamps: true });

const Appointments = mongoose.model('Appointments', appointmentSchema);
module.exports = Appointments;