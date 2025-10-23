const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  loai_tai_khoan: { type: String, enum: ['business', 'personal'], required: true },
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  sodienthoai: { type: String, required: false, match: /^[0-9]{10,11}$/ },
  diachi: { type: String, required: false },
  ngayvao: { type: Date, required: true },
  nguoidaidien: { type: String },
  hinhanh: { type: String },
  chuoi: { type: Number, min: 0, required: false },
  diemthuong: { type: Number, min: 0, default: 0 },
  buocchan: { type: Number, min: 0, default: 0 },
  matkhau: { type: String, required: true },
  gioitinh: { type: String, enum: ['male','female'], required: false },
  trangthai: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
  additional_info: {
    vai_tro: { type: String, enum: ['nhanvien', 'khachhang'] },
    mota: { type: String },
    ngaybatdau: { type: Date },
    ngayketthuc: { type: Date },
    chinhanhID: { type: mongoose.Schema.Types.ObjectId, ref: 'Chinhanh' },
    nhanvienUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ngaydangky: { type: Date },
    trangthai_vai_tro: { type: String, enum: ['active', 'inactive', 'tamngung'] }
  }
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ loai_tai_khoan: 1 });
userSchema.index({ ngayvao: 1 });
userSchema.index({ 'additional_info.chinhanhID': 1 });
userSchema.index({ 'additional_info.nhanvienUserID': 1 });
userSchema.index({ 'additional_info.vai_tro': 1 });
userSchema.index({ loai_tai_khoan: 1, 'additional_info.vai_tro': 1 });

module.exports = mongoose.model('User', userSchema);