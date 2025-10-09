const express = require('express');
const router = express.Router();
const NhanVien = require('../models/NhanVien');
const User = require('../models/User');

// Middleware to check user type
const checkUserType = (allowedTypes) => async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user || !allowedTypes.includes(user.loai_tai_khoan)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

router.get('/', async (req, res) => {
  try {
    const nhanvien = await NhanVien.find().populate('userID chinhanhID');
    res.json(nhanvien);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/chinhanh/:chinhanhID', async (req, res) => {
  try {
    const nhanvien = await NhanVien.find({ chinhanhID: req.params.chinhanhID }).populate('userID chinhanhID');
    res.json(nhanvien);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', checkUserType(['business']), async (req, res) => {
  try {
    const nhanvien = new NhanVien({
      ...req.body,
      ngaybatdau: new Date(),
      trangthai: 'active'
    });
    await nhanvien.save();
    res.status(201).json(nhanvien);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', checkUserType(['business']), async (req, res) => {
  try {
    const nhanvien = await NhanVien.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!nhanvien) return res.status(404).json({ error: 'Employee not found' });
    res.json(nhanvien);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', checkUserType(['business']), async (req, res) => {
  try {
    const nhanvien = await NhanVien.findByIdAndDelete(req.params.id);
    if (!nhanvien) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;