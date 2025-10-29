const express = require('express');
const router = express.Router();
const Dinhduong = require('../models/DinhDuong');
const User = require('../models/User');

// GET: Lấy tất cả data dinh dưỡng (sắp xếp từ mới nhất)
router.get('/', async (req, res) => {
  try {
    console.log('🔍 GET /dinhduong - Getting all nutrition data');
    
    const dinhduong = await Dinhduong.find({})
      .sort({ ngaytao: -1 })
      .populate('userID', 'ten email gioitinh'); // Populate thông tin user
    
    console.log('✅ Found records:', dinhduong.length);
    res.json(dinhduong);
  } catch (err) {
    console.error('❌ GET all error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET: Lấy data dinh dưỡng theo userID (mới nhất)
router.get('/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    console.log('� GET /dinhduong/user/' + userID);
    
    // Kiểm tra user có tồn tại không
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    
    // Lấy data dinh dưỡng mới nhất của user
    const dinhduong = await Dinhduong.findOne({ userID })
      .sort({ ngaytao: -1 });
    
    if (!dinhduong) {
      return res.status(404).json({ error: 'Chưa có dữ liệu dinh dưỡng cho user này' });
    }
    
    console.log('✅ Found nutrition data for user:', user.ten);
    res.json(dinhduong);
  } catch (err) {
    console.error('❌ GET user nutrition error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST: Tạo mới + tính toán đầy đủ các chỉ số
router.post('/', async (req, res) => {
  try {
    const {
      userID,
      chieucao,
      cannang,
    } = req.body;

    if (!userID || !chieucao || !cannang) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (userID, chieucao, cannang)' });
    }

    // Lấy thông tin user để biết giới tính
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    const gioitinh = user.gioitinh;
    const tuoiChung = 25; // Sử dụng tuổi chung chung

    // Tính lượng nước cần uống (L) - công thức: (cân nặng * 30ml + chiều cao * 10ml) / 1000
    const luongnuoc = ((cannang * 30) + (chieucao * 10)) / 1000;

    // Tính BMI
    const bmi = cannang / ((chieucao / 100) ** 2);

    // Tính LBM (Lean Body Mass) - khối lượng cơ bắp
    let lbm = 0;
    if (gioitinh === 'male') {
      lbm = 0.407 * cannang + 0.267 * chieucao - 19.2;
    } else {
      lbm = 0.252 * cannang + 0.473 * chieucao - 48.3;
    }

    // Tính BMR (Base Metabolic Rate) - lượng calo cơ bản
    let bmr = 0;
    if (gioitinh === 'male') {
      bmr = 88.362 + (13.397 * cannang) + (4.799 * chieucao) - (5.677 * tuoiChung);
    } else {
      bmr = 447.593 + (9.247 * cannang) + (3.098 * chieucao) - (4.330 * tuoiChung);
    }

    // Tính các macro nutrients dựa trên BMR (tỷ lệ chuẩn)
    const calo = Math.round(bmr * 1.5); // Nhân 1.5 cho hoạt động nhẹ
    const protein = Math.round((calo * 0.25) / 4); // 25% calo từ protein (1g = 4 calo)
    const carbs = Math.round((calo * 0.45) / 4); // 45% calo từ carbs (1g = 4 calo)  
    const fat = Math.round((calo * 0.30) / 9); // 30% calo từ fat (1g = 9 calo)

    const dinhduong = new Dinhduong({
      userID: userID,
      chieucao: Number(chieucao),
      cannang: Number(cannang),
      cannang: Number(cannang),
      luongnuoc: Number(luongnuoc.toFixed(2)),
      calo: Number(calo),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      bmi: Number(bmi.toFixed(1)),
      lbm: Number(lbm.toFixed(1)),
      ngaytao: new Date(),
    });

    const saved = await dinhduong.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Cập nhật hàng tháng với lưu dữ liệu cũ
router.put('/:id', async (req, res) => {
  try {
    const {
      chieucao,
      cannang,
    } = req.body;

    const dinhduong = await Dinhduong.findById(req.params.id);
    if (!dinhduong) return res.status(404).json({ error: 'Not found' });

    // Lấy thông tin user để biết giới tính
    const user = await User.findById(dinhduong.userID);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    const gioitinh = user.gioitinh;
    const tuoiChung = 25; // Sử dụng tuổi chung chung

    // Lưu dữ liệu cũ vào trường tháng trước
    dinhduong.chieucaothangtruoc = dinhduong.chieucao;
    dinhduong.cannangthangtruoc = dinhduong.cannang;

    // Cập nhật dữ liệu mới
    if (chieucao) dinhduong.chieucao = Number(chieucao);
    if (cannang) dinhduong.cannang = Number(cannang);

    // Tính toán lại các chỉ số với dữ liệu mới
    const luongnuoc = ((dinhduong.cannang * 30) + (dinhduong.chieucao * 10)) / 1000;
    dinhduong.luongnuoc = Number(luongnuoc.toFixed(2));

    // Tính BMI
    const bmi = dinhduong.cannang / ((dinhduong.chieucao / 100) ** 2);
    dinhduong.bmi = Number(bmi.toFixed(1));

    // Tính LBM
    let lbm = 0;
    if (gioitinh === 'male') {
      lbm = 0.407 * dinhduong.cannang + 0.267 * dinhduong.chieucao - 19.2;
    } else {
      lbm = 0.252 * dinhduong.cannang + 0.473 * dinhduong.chieucao - 48.3;
    }
    dinhduong.lbm = Number(lbm.toFixed(1));

    // Tính BMR và macro nutrients
    let bmr = 0;
    if (gioitinh === 'male') {
      bmr = 88.362 + (13.397 * dinhduong.cannang) + (4.799 * dinhduong.chieucao) - (5.677 * tuoiChung);
    } else {
      bmr = 447.593 + (9.247 * dinhduong.cannang) + (3.098 * dinhduong.chieucao) - (4.330 * tuoiChung);
    }

    const calo = Math.round(bmr * 1.5);
    const protein = Math.round((calo * 0.25) / 4);
    const carbs = Math.round((calo * 0.45) / 4);  
    const fat = Math.round((calo * 0.30) / 9);

    dinhduong.calo = Number(calo);
    dinhduong.protein = Number(protein);
    dinhduong.carbs = Number(carbs);
    dinhduong.fat = Number(fat);

    // Cập nhật ngày tạo
    dinhduong.ngaytao = new Date();

    await dinhduong.save();
    res.json(dinhduong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;