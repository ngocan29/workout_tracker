import mongoose from 'mongoose';

const lichhenSchema = new mongoose.Schema(
  {
    khachhangID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Thiếu thông tin khách hàng'],
    },
    nhanvienID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Thiếu thông tin nhân viên phụ trách'],
    },
    ngayhen: {
      type: Date,
      required: [true, 'Ngày hẹn là bắt buộc'],
    },
    ghichu: {
      type: String,
      default: '',
    },
    trangthai: {
      type: String,
      enum: ['choxacnhan', 'xacnhan', 'hoanthanh', 'huy'],
      default: 'choxacnhan',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Người tạo lịch (phải trùng với nhanvienID)
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Lichhen', lichhenSchema);
