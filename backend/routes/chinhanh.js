const express = require('express');
const router = express.Router();
const Chinhanh = require('../models/ChiNhanh');
const User = require('../models/User');

// Middleware to check user type and set user info
const checkUserType = (allowedTypes) => async (req, res, next) => {
  try {
    // Lấy userId từ header hoặc body (tạm thời dùng body, sau này sẽ dùng JWT token)
    const userId = req.headers['user-id'] || req.body.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }
    
    const user = await User.findById(userId);
    if (!user || !allowedTypes.includes(user.loai_tai_khoan)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Gắn thông tin user vào request để sử dụng trong các handler
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Lấy tất cả chi nhánh (admin only)
router.get('/', async (req, res) => {
  try {
    const chinhanh = await Chinhanh.find().populate('congtyID');
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy chi nhánh theo congtyID (business user)
router.get('/company/:congtyID', async (req, res) => {
  try {
    const { congtyID } = req.params;
    const chinhanh = await Chinhanh.find({ congtyID }).populate('congtyID');
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy chi nhánh của user hiện tại (business user)
router.get('/my-branches', checkUserType(['business']), async (req, res) => {
  try {
    const chinhanh = await Chinhanh.find({ congtyID: req.user._id }).populate('congtyID');
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', checkUserType(['business']), async (req, res) => {
  try {
    const chinhanh = new Chinhanh({
      ...req.body,
      congtyID: req.user._id, // Tự động gắn congtyID từ user hiện tại
      ngaytao: new Date(),
      trangthai: 'active'
    });
    await chinhanh.save();
    res.status(201).json(chinhanh);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', checkUserType(['business']), async (req, res) => {
  try {
    // Kiểm tra xem chi nhánh có thuộc về user hiện tại không
    const existingBranch = await Chinhanh.findOne({ _id: req.params.id, congtyID: req.user._id });
    if (!existingBranch) {
      return res.status(404).json({ error: 'Branch not found or unauthorized' });
    }
    
    const chinhanh = await Chinhanh.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, congtyID: req.user._id }, // Đảm bảo congtyID không bị thay đổi
      { new: true }
    );
    res.json(chinhanh);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', checkUserType(['business']), async (req, res) => {
  try {
    // Kiểm tra xem chi nhánh có thuộc về user hiện tại không
    const chinhanh = await Chinhanh.findOneAndDelete({ _id: req.params.id, congtyID: req.user._id });
    if (!chinhanh) {
      return res.status(404).json({ error: 'Branch not found or unauthorized' });
    }
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;