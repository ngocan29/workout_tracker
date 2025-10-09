const mongoose = require('mongoose');

const muctieuSchema = new mongoose.Schema({
  baitapID: { type: mongoose.Schema.Types.ObjectId, required: true },
  khachhangID: { type: mongoose.Schema.Types.ObjectId },
  userID: { type: mongoose.Schema.Types.ObjectId },
  thoigiantap: { type: Number, min: 0, required: true },
  tongthoigiantap: { type: Number, min: 0, required: true },
  thongke: { type: Number },
  muctieu: { type: String, required: true },
  trangthai: { type: String, enum: ['dangtap', 'hoanthanh', 'thatbai'], default: 'dangtap' },
  ngaytao: { type: Date, required: true }
}, { collection: 'muctieu' });

muctieuSchema.index({ khachhangID: 1 });
muctieuSchema.index({ baitapID: 1 });
muctieuSchema.index({ ngaytao: 1 });

module.exports = mongoose.model('MucTieu', muctieuSchema);