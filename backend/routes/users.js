const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { matkhau, gioitinh, ...rest } = req.body;
    
    // Validation số điện thoại
    if (rest.sodienthoai && !/^[0-9]{10,11}$/.test(rest.sodienthoai)) {
      return res.status(400).json({ error: `Số điện thoại không hợp lệ: ${rest.sodienthoai}. Phải có 10-11 chữ số.` });
    }
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: rest.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Kiểm tra giới tính (optional)
    if (gioitinh && !['male', 'female'].includes(gioitinh)) {
      return res.status(400).json({ error: 'Giới tính phải là male, female, Nam, Nữ hoặc Khác' });
    }
    
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    
    const user = new User({
      ...rest,
      matkhau: hashedPassword,
      gioitinh,
      ngayvao: rest.ngayvao || new Date(),
      chuoi: rest.chuoi || 0,
      trangthai: rest.trangthai || 'active'
    });
    
    const newUser = await user.save();
    const userResponse = newUser.toObject();
    delete userResponse.matkhau;
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { matkhau, gioitinh, ...updateData } = req.body;
    
    // Nếu có mật khẩu mới, hash nó
    if (matkhau) {
      updateData.matkhau = await bcrypt.hash(matkhau, 10);
    }
    
    // Kiểm tra giới tính nếu được cập nhật (optional)
    if (gioitinh && !['male', 'female', 'Nam', 'Nữ', 'Khác'].includes(gioitinh)) {
      return res.status(400).json({ error: 'Giới tính phải là male, female, Nam, Nữ hoặc Khác' });
    }
    
    Object.assign(user, { ...updateData, gioitinh });
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách khách hàng theo chi nhánh
router.get('/khachhang/:chinhanhID', async (req, res) => {
  try {
    const { chinhanhID } = req.params;
    const users = await User.find({
      'additional_info.vai_tro': 'khachhang',
      'additional_info.chinhanhID': chinhanhID,
      'additional_info.trangthai_vai_tro': 'active'
    });
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy danh sách nhân viên theo chi nhánh
router.get('/nhanvien/:chinhanhID', async (req, res) => {
  try {
    const { chinhanhID } = req.params;
    const users = await User.find({
      'additional_info.vai_tro': 'nhanvien',
      'additional_info.chinhanhID': chinhanhID,
      'additional_info.trangthai_vai_tro': 'active'
    });
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Tìm kiếm user theo email
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;