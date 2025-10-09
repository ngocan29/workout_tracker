const mongoose = require('mongoose');

const nhanvienSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  hinhanh: { type: String },
  mota: { type: String, required: true },
  ngaybatdau: { type: Date, required: true },
  ngayketthuc: { type: Date },
  chinhanhID: { type: mongoose.Schema.Types.ObjectId, required: true },
  trangthai: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { collection: 'nhanvien' });

nhanvienSchema.index({ userID: 1 }, { unique: true });
nhanvienSchema.index({ chinhanhID: 1 });

module.exports = mongoose.model('NhanVien', nhanvienSchema);