const mongoose = require('mongoose');

const danhmucSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  chinhanhID: { type: mongoose.Schema.Types.ObjectId, ref: 'Chinhanh' },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // User tạo danh mục này
});

danhmucSchema.index({ ten: 1 }, { unique: true });
danhmucSchema.index({ ten: 'text' });

module.exports = mongoose.model('Danhmuc', danhmucSchema);