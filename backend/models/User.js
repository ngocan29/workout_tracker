const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  loai_tai_khoan: { type: String, enum: ['business', 'personal'], required: true },
  email: { type: String, required: true, match: /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/ },
  sodienthoai: { type: String, required: true, match: /^[0-9]{10,11}$/ },
  diachi: { type: String, required: true },
  ngayvao: { type: Date, required: true },
  nguoidaidien: { type: String },
  hinhanh: { type: String },
  chuoi: { type: Number, min: 0, required: true },
  matkhau: { type: String },
  trangthai: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' }
}, { collection: 'users' });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ loai_tai_khoan: 1 });
userSchema.index({ ngayvao: 1 });

module.exports = mongoose.model('User', userSchema);