const mongoose = require('mongoose');

const dinhduongSchema = new mongoose.Schema({
  khachhangID: { type: mongoose.Schema.Types.ObjectId },
  userID: { type: mongoose.Schema.Types.ObjectId },
  chieucao: { type: Number, required: true },
  cannang: { type: Number, required: true },
  luongnuoc: { type: Number, required: true },
  calo: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
  ngaytao: { type: Date, required: true },
  chieucaothangtruoc: { type: Number },
  cannangthangtruoc: { type: Number },
  bmi: { type: Number },
  lbm: { type: Number }
}, { collection: 'dinhduong' });

dinhduongSchema.index({ khachhangID: 1 });
dinhduongSchema.index({ ngaytao: 1 });

module.exports = mongoose.model('DinhDuong', dinhduongSchema);