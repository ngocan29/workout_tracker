const express = require('express');
const router = express.Router();
const Baitap = require('../models/BaiTap');
const User = require('../models/User');
const Danhmuc = require('../models/DanhMuc');

// Middleware để reset sophuttap về 0 vào 0:00 mỗi ngày
const resetDailyWorkoutTime = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    // Tìm bài tập nào có ngaycapnhat không phải hôm nay và có sophuttap > 0
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const result = await Baitap.updateMany(
      {
        $or: [
          { ngaycapnhat: { $lt: today } },
          { ngaycapnhat: { $exists: false } }
        ],
        sophuttap: { $gt: 0 }
      },
      { 
        sophuttap: 0,
        ngaycapnhat: new Date()
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('🔄 Đã reset sophuttap cho', result.modifiedCount, 'bài tập');
    }
  } catch (error) {
    console.error('❌ Lỗi khi reset daily workout time:', error);
  }
  next();
};

//lấy all
router.get('/', resetDailyWorkoutTime, async (req, res) => {
  try {
    const { userID, chinhanhID } = req.query;
    let query = {};
    
    if (userID) {
      query.userID = userID;
    }
    
    if (chinhanhID) {
      query.chinhanhID = chinhanhID;
    }
    
    console.log('🔍 Fetching workouts with query:', query);
    
    const baitap = await Baitap.find(query)
      .populate('danhmucID', 'ten')
      .populate('userID', 'ho_ten ten email additional_info')
      .populate('chinhanhID', 'ten_chi_nhanh ten')
      .sort({ ngaytao: -1 }); // Sắp xếp theo ngày tạo mới nhất
    
    console.log('📋 Found workouts:', baitap.length);
    res.json({
      success: true,
      data: baitap,
      message: 'Lấy danh sách bài tập thành công'
    });
  } catch (err) {
    console.error('❌ Error fetching workouts:', err);
    res.status(500).json({ 
      success: false,
      error: err.message,
      message: 'Lỗi khi lấy danh sách bài tập'
    });
  }
});

//thêm
router.post('/', async (req, res) => {
  try {
    // Lấy userID từ header
    const userID = req.headers['user-id'];
    
    // Tạo object bài tập với dữ liệu từ request
    const baitapData = {
      ...req.body,
      ngaytao: req.body.ngaytao || new Date(),
      thongke: req.body.thongke || 0,
      trangthai: req.body.trangthai || 'chuahoanthanh'
    };
    
    // Gán userID nếu có
    if (userID) {
      baitapData.userID = userID;
      
      // Lấy thông tin user để xác định chinhanhID
      const user = await User.findById(userID);
      if (user) {
        // Ưu tiên lấy chinhanhID từ additional_info, fallback về trường chinhanhID trực tiếp
        const chinhanhID = user.additional_info?.chinhanhID || user.chinhanhID;
        if (chinhanhID) {
          baitapData.chinhanhID = chinhanhID;
          console.log('✅ Auto-assigned chinhanhID:', chinhanhID, 'for user:', userID);
        }
      }
    }
    
    console.log('📝 Creating workout with data:', baitapData);
    
    const baitap = new Baitap(baitapData);
    const newBaitap = await baitap.save();
    
    // Populate danhmucID trước khi trả về
    await newBaitap.populate('danhmucID', 'ten');
    
    res.status(201).json(newBaitap);
  } catch (err) {
    console.error('❌ Error creating workout:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET bài tập theo chi nhánh (đặt trước route /:id để tránh conflict)
router.get('/chinhanh/:chinhanhID', async (req, res) => {
  try {
    const { chinhanhID } = req.params;
    const { danhmucID } = req.query; // Thêm filter theo danh mục
    
    console.log('🔍 Searching workouts for branch:', chinhanhID);
    console.log('🔍 Category filter:', danhmucID);
    
    // Lấy toàn bộ bài tập của chi nhánh (không loại trừ user hiện tại)
    let query = { chinhanhID };
    
    // Thêm filter theo danh mục nếu có
    if (danhmucID) {
      query.danhmucID = danhmucID;
    }
    
    const baitap = await Baitap.find(query)
      .populate('danhmucID', 'ten')
      .populate('userID', 'ho_ten ten email additional_info')
      .populate('chinhanhID', 'ten_chi_nhanh ten')
      .sort({ ngaytao: -1 });
    
    console.log('📋 Found branch workouts:', baitap.length);
    res.json({
      success: true,
      data: baitap,
      message: 'Lấy danh sách bài tập chi nhánh thành công'
    });
  } catch (err) {
    console.error('❌ Error getting workouts by branch:', err);
    res.status(500).json({ 
      success: false,
      error: err.message,
      message: 'Lỗi khi lấy danh sách bài tập chi nhánh'
    });
  }
});

//lấy 1 bài tập theo id
router.get('/:id', resetDailyWorkoutTime, async (req, res) => {
  try {
    const baitap = await Baitap.findById(req.params.id)
      .populate('danhmucID', 'ten')
      .populate('userID', 'ho_ten ten email additional_info')
      .populate('chinhanhID', 'ten_chi_nhanh ten');
      
    if (!baitap) return res.status(404).json({ error: 'Baitap not found' });
    
    console.log('📋 Retrieved workout:', req.params.id);
    res.json(baitap);
  } catch (err) {
    console.error('❌ Error fetching workout detail:', err);
    res.status(500).json({ error: err.message });
  }
});

//update
router.put('/:id', resetDailyWorkoutTime, async (req, res) => {
  try {
    const baitap = await Baitap.findById(req.params.id);
    if (!baitap) return res.status(404).json({ error: 'Baitap not found' });
    
    // Xử lý logic thống kê và điểm thưởng
    if (req.body.trangthai === 'hoanthanh' && baitap.trangthai !== 'hoanthanh') {
      baitap.thongke += 1;
      if (baitap.khachhangUserID) {
        const user = await User.findById(baitap.khachhangUserID);
        if (user) {
          user.diemthuong += 10;
          await user.save();
        }
      }
    }
    
    // Cập nhật dữ liệu bài tập
    Object.assign(baitap, req.body);
    
    // Tự động cập nhật chinhanhID nếu cần (dựa vào userID hiện tại)
    if (baitap.userID) {
      const user = await User.findById(baitap.userID);
      if (user) {
        const chinhanhID = user.additional_info?.chinhanhID || user.chinhanhID;
        if (chinhanhID && !baitap.chinhanhID) {
          baitap.chinhanhID = chinhanhID;
          console.log('✅ Auto-updated chinhanhID:', chinhanhID, 'for workout:', req.params.id);
        }
      }
    }
    
    baitap.ngaycapnhat = new Date();
    await baitap.save();
    
    // Populate danhmucID trước khi trả về
    await baitap.populate('danhmucID', 'ten');
    
    res.json(baitap);
  } catch (err) {
    console.error('❌ Error updating workout:', err);
    res.status(400).json({ error: err.message });
  }
});

//delete
router.delete('/:id', async (req, res) => {
  try {
    const baitap = await Baitap.findById(req.params.id);
    if (!baitap) return res.status(404).json({ error: 'Baitap not found' });
    await Baitap.findByIdAndDelete(req.params.id);
    res.json({ message: 'Baitap deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;