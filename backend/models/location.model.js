import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    index: true
  },
  type: { 
    type: String, 
    required: true,
    enum: ['province', 'district', 'ds-division'],
    index: true
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location',
    index: true
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

export default mongoose.model('Location', locationSchema);