//1️⃣ Lấy tất cả lịch hẹn (GET /)
const lichhen = await Lichhen.find()
  .populate('khachhangID nhanvienID createdBy')
  .sort({ ngayhen: 1 }); // sắp xếp theo ngày gần nhất


//2️⃣ Lấy lịch hẹn theo khách hàng và nhân viên (GET /khachhang/:khachhangID/nhanvien/:nhanvienID)
const lichhen = await Lichhen.find({
  khachhangID: req.params.khachhangID,
  nhanvienID: req.params.nhanvienID,
})
  .populate('khachhangID nhanvienID')
  .sort({ ngayhen: 1 }); // hiển thị lịch gần nhất đầu tiên


//3️⃣ Thêm lịch hẹn (POST /)
//Kiểm tra req.user._id (người gửi yêu cầu) có trùng nhanvienID không.
//Nếu không trùng, trả về 403 - Không có quyền.
if (req.user._id.toString() !== req.body.nhanvienID) {
  return res.status(403).json({ message: 'Bạn không có quyền tạo lịch hẹn cho khách hàng này.' });
}
const newLichhen = await Lichhen.create({
  ...req.body,
  createdBy: req.user._id,
});


//4️⃣ Sửa lịch hẹn (PUT /:id)
//Kiểm tra người sửa có phải là nhân viên phụ trách hoặc người tạo không.
//Nếu không, từ chối.
const lichhen = await Lichhen.findById(req.params.id);
if (!lichhen) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });

if (lichhen.nhanvienID.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: 'Không có quyền sửa lịch hẹn này.' });
}
const updated = await Lichhen.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);


//5️⃣ Xóa lịch hẹn (DELETE /:id)
const lichhen = await Lichhen.findById(req.params.id);
if (!lichhen) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });

if (lichhen.nhanvienID.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: 'Không có quyền xóa lịch hẹn này.' });
}

await Lichhen.findByIdAndDelete(req.params.id);
res.json({ message: 'Đã xóa lịch hẹn' });

🛣️ IV. Router (routes/lichhenRoutes.js)
import express from 'express';
import {
  getAllLichhen,
  getLichhenByKhachhangAndNhanvien,
  createLichhen,
  updateLichhen,
  deleteLichhen
} from '../controllers/lichhenController.js';
import { protect } from '../middleware/authMiddleware.js'; // middleware xác thực JWT

const router = express.Router();

router.get('/', protect, getAllLichhen);
router.get('/khachhang/:khachhangID/nhanvien/:nhanvienID', protect, getLichhenByKhachhangAndNhanvien);
router.post('/', protect, createLichhen);
router.put('/:id', protect, updateLichhen);
router.delete('/:id', protect, deleteLichhen);

export default router;