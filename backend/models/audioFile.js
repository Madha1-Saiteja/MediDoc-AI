const mongoose = require('mongoose');

const audioFileSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AudioFile', audioFileSchema);