import mongoose from 'mongoose';

const baitapSchema = new mongoose.Schema(
  {
    tenbaitap: {
      type: String,
      required: [true, 'Tên bài tập là bắt buộc'],
      trim: true,
    },
    mota: {
      type: String,
      default: '',
    },
    loai: {
      type: String,
      enum: ['personal', 'company', 'default'],
      default: 'personal', // personal: user tự tạo, company: PT giao, default: bài mặc định
    },
    thoigian: {
      type: Number, // phút
      default: 0,
    },
    trangthai: {
      type: String,
      enum: ['chuahoanthanh', 'hoanthanh'],
      default: 'chuahoanthanh',
    },
    ngayTao: {
      type: Date,
      default: Date.now,
    },
    // Liên kết khóa ngoại
    khachhangID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // người tập
    },
    ptID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // PT tạo bài cho khách
    },
    congtyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // admin công ty
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Baitap', baitapSchema);
