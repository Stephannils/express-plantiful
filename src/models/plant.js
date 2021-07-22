const mongoose = require('mongoose');

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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
},{ timestamps: true});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;