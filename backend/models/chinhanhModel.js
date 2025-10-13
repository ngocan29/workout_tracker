import mongoose from 'mongoose';

const chinhanhSchema = new mongoose.Schema(
  {
    tenchinhanh: {
      type: String,
      required: [true, 'Tên chi nhánh là bắt buộc'],
      trim: true,
    },
    diachi: {
      type: String,
      required: [true, 'Địa chỉ là bắt buộc'],
    },
    sodienthoai: {
      type: String,
      match: [/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'],
    },
    congtyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Nếu user admin là chủ công ty
      required: [true, 'Công ty ID là bắt buộc'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Chinhanh', chinhanhSchema);
