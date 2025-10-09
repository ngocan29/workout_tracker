const mongoose = require('mongoose');

const khachhangSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  hinhanh: { type: String },
  chuoi: { type: Number, min: 0, required: true },
  diemthuong: { type: Number, min: 0, required: true },
  buocchan: { type: Number, min: 0, required: true },
  chinhanhID: { type: mongoose.Schema.Types.ObjectId, required: true },
  nhanvienID: { type: mongoose.Schema.Types.ObjectId },
  trangthai: { type: String, enum: ['active', 'inactive', 'tamngung'], default: 'active' },
  ngaydangky: { type: Date, required: true }
}, { collection: 'khachhang' });

khachhangSchema.index({ userID: 1 }, { unique: true });
khachhangSchema.index({ chinhanhID: 1 });
khachhangSchema.index({ nhanvienID: 1 });

module.exports = mongoose.model('KhachHang', khachhangSchema);