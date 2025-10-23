const mongoose = require('mongoose');

const chinhanhSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  diachi: { type: String, required: true },
  congtyID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trangthai: { type: String, enum: ['active', 'inactive'], default: 'active' },
  ngaytao: { type: Date, required: true }
});

chinhanhSchema.index({ congtyID: 1 });
chinhanhSchema.index({ ten: 1 });
chinhanhSchema.index({ trangthai: 1 });
chinhanhSchema.index({ congtyID: 1, trangthai: 1 });
chinhanhSchema.index({ ngaytao: -1 });

module.exports = mongoose.model('Chinhanh', chinhanhSchema);