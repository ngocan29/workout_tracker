const express = require('express');
const router = express.Router();
const KhachHang = require('../models/KhachHang');
const User = require('../models/User');
const MucTieu = require('../models/MucTieu');
const BaiTap = require('../models/BaiTap');

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
    const khachhang = await KhachHang.find().populate('userID chinhanhID nhanvienID');
    res.json(khachhang);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/chinhanh/:chinhanhID', async (req, res) => {
  try {
    const khachhang = await KhachHang.find({ chinhanhID: req.params.chinhanhID }).populate('userID chinhanhID nhanvienID');
    res.json(khachhang);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', checkUserType(['business', 'nhanvien']), async (req, res) => {
  try {
    const khachhang = new KhachHang({
      ...req.body,
      ngaydangky: new Date(),
      trangthai: 'active',
      chuoi: 0,
      diemthuong: 0,
      buocchan: 0
    });
    await khachhang.save();
    res.status(201).json(khachhang);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', checkUserType(['business']), async (req, res) => {
  try {
    const khachhang = await KhachHang.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!khachhang) return res.status(404).json({ error: 'Customer not found' });
    res.json(khachhang);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', checkUserType(['business']), async (req, res) => {
  try {
    const khachhang = await KhachHang.findByIdAndDelete(req.params.id);
    if (!khachhang) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/chuoi/khachhang/:khachhangID', async (req, res) => {
  try {
    const muctieu = await MucTieu.findOne({ khachhangID: req.params.khachhangID, ngaytao: { $gte: new Date().setHours(0,0,0,0) } });
    if (muctieu && muctieu.thoigiantap >= muctieu.muctieu) {
      await KhachHang.findByIdAndUpdate(req.params.khachhangID, { $inc: { chuoi: 1 } });
    } else {
      await KhachHang.findByIdAndUpdate(req.params.khachhangID, { chuoi: 0 });
    }
    res.json({ message: 'Chain updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/chuoi/personal/:userID', async (req, res) => {
  try {
    const muctieu = await MucTieu.findOne({ userID: req.params.userID, ngaytao: { $gte: new Date().setHours(0,0,0,0) } });
    if (muctieu && muctieu.thoigiantap >= muctieu.muctieu) {
      await User.findByIdAndUpdate(req.params.userID, { $inc: { chuoi: 1 } });
    } else {
      await User.findByIdAndUpdate(req.params.userID, { chuoi: 0 });
    }
    res.json({ message: 'Chain updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/diemthuong/khachhang/:khachhangID', async (req, res) => {
  try {
    const baitap = await BaiTap.findOne({ khachhangID: req.params.khachhangID, ngaytao: { $gte: new Date().setHours(0,0,0,0) } });
    if (baitap && baitap.thongke > 0) {
      await KhachHang.findByIdAndUpdate(req.params.khachhangID, { $inc: { diemthuong: baitap.thongke * 10 } });
    }
    res.json({ message: 'Points updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/diemthuong/personal/:userID', async (req, res) => {
  try {
    const baitap = await BaiTap.findOne({ userID: req.params.userID, ngaytao: { $gte: new Date().setHours(0,0,0,0) } });
    if (baitap && baitap.thongke > 0) {
      await User.findByIdAndUpdate(req.params.userID, { $inc: { diemthuong: baitap.thongke * 10 } });
    }
    res.json({ message: 'Points updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;