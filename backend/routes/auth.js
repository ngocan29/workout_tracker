const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    const { ten, loai_tai_khoan, email, sodienthoai, diachi, nguoidaidien, matkhau, ngayvao, chuoi } = req.body;
    
    // Validation số điện thoại
    if (sodienthoai && !/^[0-9]{10,11}$/.test(sodienthoai)) {
      console.log('❌ Invalid phone number:', sodienthoai);
      return res.status(400).json({ error: `Số điện thoại không hợp lệ: ${sodienthoai}. Phải có 10-11 chữ số.` });
    }
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    
    const user = new User({
      ten,
      loai_tai_khoan,
      email,
      sodienthoai,
      diachi,
      nguoidaidien,
      matkhau: hashedPassword,
      ngayvao: ngayvao || new Date(),
      chuoi: chuoi || 0,
      trangthai: 'active'
    });
    
    console.log('💾 Saving user:', { ten, email, sodienthoai, loai_tai_khoan });
    await user.save();
    
    // Không trả về mật khẩu
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    
    console.log('✅ User registered successfully:', userResponse._id);
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userResponse 
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, matkhau } = req.body;
    
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Kiểm tra mật khẩu
    console.log('Login attempt:', { email, matkhau, storedPassword: user.matkhau });
    const isPasswordValid = await bcrypt.compare(matkhau, user.matkhau);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Kiểm tra trạng thái tài khoản
    if (user.trangthai !== 'active') {
      return res.status(401).json({ error: 'Account is not active' });
    }
    
    // Không trả về mật khẩu
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    
    res.json({ 
      message: 'Login successful', 
      user: userResponse
      // TODO: Thêm JWT token ở đây
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Đăng xuất (đơn giản, sau này có thể thêm token blacklist)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Lấy thông tin profile hiện tại
router.get('/profile', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }
    
    const user = await User.findById(userId);
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

// Cập nhật thông tin profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }
    
    const { matkhau, ...updateData } = req.body;
    
    // Nếu có mật khẩu mới, hash nó
    if (matkhau) {
      updateData.matkhau = await bcrypt.hash(matkhau, 10);
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: userResponse 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;