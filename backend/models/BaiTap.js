const mongoose = require('mongoose');

const baitapSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  calo: { type: Number },
  mota: { type: String, required: true },
  thoigiangoc: { type: Number, min: 1, required: true },
  hengio: { type: Date },
  cacbuoc: { type: Array, required: true },
  loiich: { type: Array, required: true },
  trangthai: { type: String, enum: ['hoanthanh', 'chuahoanthanh'], required: true },
  thongke: { type: Number, min: 0, default: 0 },
  sophuttap: { type: Number, min: 0, default: 0 },
  anhminhhoa: { type: String, default: 'https://via.placeholder.com/300x200/ccc/000?text=No+Image' },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chinhanhID: { type: mongoose.Schema.Types.ObjectId, ref: 'Chinhanh' },
  danhmucID: { type: mongoose.Schema.Types.ObjectId, ref: 'Danhmuc' },
  ngaytao: { type: Date, required: true },
  ngaycapnhat: { type: Date }
});

baitapSchema.index({ khachhangUserID: 1 });
baitapSchema.index({ nhanvienUserID: 1 });
baitapSchema.index({ trangthai: 1 });
baitapSchema.index({ ngaytao: 1 });
baitapSchema.index({ danhmucID: 1 });
baitapSchema.index({ ngaycapnhat: -1 });
baitapSchema.index({ khachhangUserID: 1, trangthai: 1 });
baitapSchema.index({ userID: 1 });
baitapSchema.index({ thongke: -1 });

module.exports = mongoose.model('Baitap', baitapSchema);