import Chinhanh from '../models/chinhanhModel.js';

// ✅ [GET] /api/chinhanh → Lấy tất cả chi nhánh
export const getAllChinhanh = async (req, res) => {
  try {
    const data = await Chinhanh.find().populate('congtyID', 'name email');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chi nhánh' });
  }
};

// ✅ [GET] /api/chinhanh/congty/:congtyID → Lấy chi nhánh theo công ty
export const getChinhanhByCongty = async (req, res) => {
  try {
    const { congtyID } = req.params;
    const data = await Chinhanh.find({ congtyID });
    if (!data.length)
      return res.status(404).json({ message: 'Không có chi nhánh nào cho công ty này' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi nhánh theo công ty' });
  }
};

// ✅ [POST] /api/chinhanh → Thêm chi nhánh mới
export const createChinhanh = async (req, res) => {
  try {
    const { tenchinhanh, diachi, sodienthoai, congtyID } = req.body;
    if (!tenchinhanh || !diachi || !congtyID)
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

    const newBranch = await Chinhanh.create({
      tenchinhanh,
      diachi,
      sodienthoai,
      congtyID,
    });

    res.status(201).json(newBranch);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm chi nhánh' });
  }
};

// ✅ [PUT] /api/chinhanh/:id → Cập nhật chi nhánh
export const updateChinhanh = async (req, res) => {
  try {
    const chinhanh = await Chinhanh.findById(req.params.id);
    if (!chinhanh) return res.status(404).json({ message: 'Chi nhánh không tồn tại' });

    chinhanh.tenchinhanh = req.body.tenchinhanh || chinhanh.tenchinhanh;
    chinhanh.diachi = req.body.diachi || chinhanh.diachi;
    chinhanh.sodienthoai = req.body.sodienthoai || chinhanh.sodienthoai;

    const updated = await chinhanh.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật chi nhánh' });
  }
};

// ✅ [DELETE] /api/chinhanh/:id → Xóa chi nhánh
export const deleteChinhanh = async (req, res) => {
  try {
    const chinhanh = await Chinhanh.findById(req.params.id);
    if (!chinhanh) return res.status(404).json({ message: 'Chi nhánh không tồn tại' });

    await chinhanh.deleteOne();
    res.json({ message: 'Đã xóa chi nhánh thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa chi nhánh' });
  }
};
