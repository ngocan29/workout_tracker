const mongoose = require('mongoose');

const lichhenSchema = new mongoose.Schema({
  khachhangID: { type: mongoose.Schema.Types.ObjectId, required: true },
  nhanvienID: { type: mongoose.Schema.Types.ObjectId, required: true },
  ngaytao: { type: Date, required: true },
  ngayhen: { type: Date, required: true },
  ghichu: { type: String },
  trangthai: { type: String, enum: ['chualichhen', 'daxacnhan', 'dahuy', 'hoanthanh'], default: 'chualichhen' },
  diadiem: { type: String }
}, { collection: 'lichhen' });

lichhenSchema.index({ khachhangID: 1 });
lichhenSchema.index({ nhanvienID: 1 });
lichhenSchema.index({ ngayhen: 1 });
lichhenSchema.index({ trangthai: 1 });

module.exports = mongoose.model('LichHen', lichhenSchema);