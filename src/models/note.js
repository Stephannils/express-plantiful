const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  note: {
    type: String,
    trim: true
  }
});

module.exports = noteSchema;