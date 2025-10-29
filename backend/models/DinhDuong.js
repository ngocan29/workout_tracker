const mongoose = require('mongoose');
const User = require('./User');

const dinhduongSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
});

dinhduongSchema.pre('save', async function(next) {
  if (this.chieucao && this.cannang) {
    this.bmi = this.cannang / ((this.chieucao / 100) ** 2);
    const user = await User.findById(this.userID);
    if (user && user.gioitinh) {
      this.lbm = user.gioitinh === 'male'
        ? 0.407 * this.cannang + 0.267 * this.chieucao - 19.2
        : 0.252 * this.cannang + 0.473 * this.chieucao - 48.3;
    }
  }
  next();
});

dinhduongSchema.index({ userID: 1 });
dinhduongSchema.index({ ngaytao: 1 });
dinhduongSchema.index({ userID: 1, ngaytao: -1 });
dinhduongSchema.index({ bmi: 1 });

module.exports = mongoose.model('Dinhduong', dinhduongSchema);