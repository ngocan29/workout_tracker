const express = require('express');
const router = express.Router();
const Danhmuc = require('../models/DanhMuc');

// GET danh mục theo chi nhánh (đặt trước route /:id để tránh conflict)
router.get('/chinhanh/:chinhanhID', async (req, res) => {
  try {
    const { chinhanhID } = req.params;
    
    console.log('🔍 Searching categories for branch:', chinhanhID);
    
    // Lấy danh mục theo chi nhánh cụ thể
    // Chỉ so sánh với ObjectId, không populate trong query
    const danhmuc = await Danhmuc.find({ chinhanhID })
      .populate('chinhanhID', 'ten')
      .populate('userID', 'ten email');
    
    console.log('📋 Found categories:', danhmuc.length);
    
    res.json(danhmuc);
  } catch (err) {
    console.error('❌ Error getting categories by branch:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET danh mục theo userID
router.get('/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    
    console.log('🔍 Searching categories for user:', userID);
    
    // Lấy danh mục theo user cụ thể
    const danhmuc = await Danhmuc.find({ userID })
      .populate('chinhanhID', 'ten')
      .populate('userID', 'ten email');
    
    console.log('📋 Found categories for user:', danhmuc.length);
    
    res.json(danhmuc);
  } catch (err) {
    console.error('❌ Error getting categories by user:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET tất cả danh mục (chỉ dùng cho admin hoặc khi không có chi nhánh cụ thể)
router.get('/', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.find()
      .populate('chinhanhID', 'ten')
      .populate('userID', 'ten email');
    res.json(danhmuc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tạo danh mục mới
router.post('/', async (req, res) => {
  try {
    const danhmucData = { ...req.body };
    
    // Debug log để kiểm tra data nhận được
    console.log('📝 Creating category with data:', danhmucData);
    
    // Lấy userID từ header (được gửi từ frontend)
    const userID = req.headers['user-id'];
    if (userID) {
      danhmucData.userID = userID;
      console.log('👤 Adding userID:', userID);
    }
    
    // Tự động gán chinhanhID và userID nếu được truyền
    const danhmuc = new Danhmuc(danhmucData);
    const newDanhmuc = await danhmuc.save();
    
    console.log('✅ Category saved:', newDanhmuc);
    
    // Populate trước khi trả về
    await newDanhmuc.populate('chinhanhID', 'ten');
    await newDanhmuc.populate('userID', 'ten email');
    res.status(201).json(newDanhmuc);
  } catch (err) {
    console.error('❌ Error creating category:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// GET danh mục theo ID
router.get('/:id', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.findById(req.params.id)
      .populate('chinhanhID', 'ten')
      .populate('userID', 'ten email');
    if (!danhmuc) return res.status(404).json({ error: 'Danh mục không tồn tại' });
    res.json(danhmuc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT cập nhật danh mục
router.put('/:id', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.findById(req.params.id);
    if (!danhmuc) return res.status(404).json({ error: 'Danh mục không tồn tại' });
    
    Object.assign(danhmuc, req.body);
    await danhmuc.save();
    
    // Populate trước khi trả về
    await danhmuc.populate('chinhanhID', 'ten');
    await danhmuc.populate('userID', 'ten email');
    res.json(danhmuc);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// DELETE xóa danh mục
router.delete('/:id', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.findById(req.params.id);
    if (!danhmuc) return res.status(404).json({ error: 'Danh mục không tồn tại' });
    
    await Danhmuc.findByIdAndDelete(req.params.id);
    res.json({ message: 'Danh mục đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;