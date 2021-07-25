const mongoose = require('mongoose');
const noteSchema = require('./note');

const plantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  waterInterval: {
    type: Number,
    required: false,
    trim: true,
    default: 7,
  },
  inCollection: {
    type: Boolean,
    required: true,
  },
  image: {
    type: Buffer,
  },
  notes: [noteSchema],
  pests: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }
},{ timestamps: true});

plantSchema.methods.toJSON = function() {
  const plant = this.toObject();

  delete plant.image;

  return plant;
};

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;