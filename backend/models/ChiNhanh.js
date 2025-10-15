const mongoose = require('mongoose');

const chinhanhSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  diachi: { type: String, required: true },
  congtyID: { type: mongoose.Schema.Types.ObjectId, required: true },
  trangthai: { type: String, enum: ['active', 'inactive'], default: 'active' },
  ngaytao: { type: Date, required: true }
}, { collection: 'chinhanh' });

chinhanhSchema.index({ congtyID: 1 });
chinhanhSchema.index({ ten: 1 });

module.exports = mongoose.model('Chinhanh', chinhanhSchema);