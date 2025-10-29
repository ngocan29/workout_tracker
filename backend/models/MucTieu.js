const mongoose = require('mongoose');

const muctieuSchema = new mongoose.Schema({
  baitapID: { type: mongoose.Schema.Types.ObjectId, ref: 'Baitap' }, // Made optional for daily goals
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thoigiantap: { type: Number, min: 0, default: 0 },
  tongthoigiantap: { type: Number, min: 0, default: 0 }, // Added missing field
  thongke: { type: Number, default: 0 },
  muctieu: { type: String, required: true },
  trangthai: { type: String, enum: ['dangtap', 'hoanthanh', 'thatbai'], default: 'dangtap' },
  ngaytao: { type: Date, default: Date.now }
});

muctieuSchema.index({ baitapID: 1 });
muctieuSchema.index({ ngaytao: 1 });
muctieuSchema.index({ trangthai: 1 });
muctieuSchema.index({ khachhangUserID: 1, baitapID: 1 });
muctieuSchema.index({ userID: 1 });

module.exports = mongoose.model('Muctieu', muctieuSchema);