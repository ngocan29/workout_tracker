const mongoose = require('mongoose');

const baitapSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  calo: { type: Number },
  mota: { type: String, required: true },
  thoigiangoc: { type: Number, min: 1, required: true },
  hengio: { type: Date },
  cacbuoc: { type: [Object], required: true },
  loiich: { type: [Object], required: true },
  trangthai: { type: String, enum: ['hoanthanh', 'chuahoanthanh'], required: true },
  thongke: { type: Number, min: 0 },
  khachhangID: { type: mongoose.Schema.Types.ObjectId },
  nhanvienID: { type: mongoose.Schema.Types.ObjectId },
  userID: { type: mongoose.Schema.Types.ObjectId },
  ngaytao: { type: Date, required: true },
  ngaycapnhat: { type: Date }
}, { collection: 'baitap' });

baitapSchema.index({ khachhangID: 1 });
baitapSchema.index({ nhanvienID: 1 });
baitapSchema.index({ trangthai: 1 });
baitapSchema.index({ ngaytao: 1 });

module.exports = mongoose.model('BaiTap', baitapSchema);