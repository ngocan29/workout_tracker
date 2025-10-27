const mongoose = require('mongoose');

const sodocotheSchema = new mongoose.Schema({
  khachhangUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bophan: [{
    ten: { type: String, required: true },
    sodo: { type: Number, required: true },
    sodothangtruoc: { type: Number }
  }],
  ngaytao: { type: Date, required: true }
});

sodocotheSchema.index({ khachhangUserID: 1 });
sodocotheSchema.index({ ngaytao: 1 });
sodocotheSchema.index({ userID: 1 });
sodocotheSchema.index({ khachhangUserID: 1, ngaytao: -1 });

module.exports = mongoose.model('Sodocothe', sodocotheSchema);