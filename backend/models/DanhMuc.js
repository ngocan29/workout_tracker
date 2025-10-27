const mongoose = require('mongoose');

const danhmucSchema = new mongoose.Schema({
  ten: { type: String, required: true }
});

danhmucSchema.index({ ten: 1 }, { unique: true });
danhmucSchema.index({ ten: 'text' });

module.exports = mongoose.model('Danhmuc', danhmucSchema);