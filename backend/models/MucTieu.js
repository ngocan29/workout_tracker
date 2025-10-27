const mongoose = require('mongoose');

const muctieuSchema = new mongoose.Schema({
  baitapID: { type: mongoose.Schema.Types.ObjectId, ref: 'Baitap', required: true },
  khachhangUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thoigiantap: { type: Number, min: 0, required: true },
  tongthoigiantap: { type: Number, min: 0, required: true },
  thongke: { type: Number },
  muctieu: { type: String, required: true },
  trangthai: { type: String, enum: ['dangtap', 'hoanthanh', 'thatbai'] },
  ngaytao: { type: Date, required: true }
});

muctieuSchema.index({ khachhangUserID: 1 });
muctieuSchema.index({ baitapID: 1 });
muctieuSchema.index({ ngaytao: 1 });
muctieuSchema.index({ trangthai: 1 });
muctieuSchema.index({ khachhangUserID: 1, baitapID: 1 });
muctieuSchema.index({ userID: 1 });
muctieuSchema.index({ tongthoigiantap: -1 });

module.exports = mongoose.model('Muctieu', muctieuSchema);