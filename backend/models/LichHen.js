const mongoose = require('mongoose');

const lichhenSchema = new mongoose.Schema({
  khachhangUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nhanvienUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngaytao: { type: Date, required: true },
  ngayhen: { type: Date, required: true },
  ghichu: { type: String },
  trangthai: { type: String, enum: ['chuaxacnhan', 'daxacnhan', 'dahuy', 'hoanthanh'] },
  diadiem: { type: String }
});

lichhenSchema.index({ khachhangUserID: 1 });
lichhenSchema.index({ nhanvienUserID: 1 });
lichhenSchema.index({ ngayhen: 1 });
lichhenSchema.index({ trangthai: 1 });
lichhenSchema.index({ nhanvienUserID: 1, ngayhen: 1, trangthai: 1 });
lichhenSchema.index({ khachhangUserID: 1, ngayhen: 1 });
lichhenSchema.index({ ngaytao: -1 });

module.exports = mongoose.model('Lichhen', lichhenSchema);