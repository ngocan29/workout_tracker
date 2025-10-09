const mongoose = require('mongoose');

const bophanSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  sodo: { type: Number, required: true },
  sodothangtruoc: { type: Number }
});

const sodocotheSchema = new mongoose.Schema({
  khachhangID: { type: mongoose.Schema.Types.ObjectId },
  userID: { type: mongoose.Schema.Types.ObjectId },
  bophan: { type: [bophanSchema], required: true },
  ngaytao: { type: Date, required: true }
}, { collection: 'sodocothe' });

sodocotheSchema.index({ khachhangID: 1 });
sodocotheSchema.index({ ngaytao: 1 });

module.exports = mongoose.model('SoDoCoThe', sodocotheSchema);