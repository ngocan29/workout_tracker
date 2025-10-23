const express = require('express');
const router = express.Router();
const Chinhanh = require('../models/ChiNhanh');

router.get('/', async (req, res) => {
  try {
    const chinhanh = await Chinhanh.find();
    res.json(chinhanh);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const chinhanh = new Chinhanh({
    ...req.body,
    ngaytao: req.body.ngaytao || new Date(),
    trangthai: req.body.trangthai || 'active'
  });
  try {
    const newChinhanh = await chinhanh.save();
    res.status(201).json(newChinhanh);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chinhanh = await Chinhanh.findById(req.params.id);
    if (!chinhanh) return res.status(404).json({ error: 'Chinhanh not found' });
    res.json(chinhanh);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const chinhanh = await Chinhanh.findById(req.params.id);
    if (!chinhanh) return res.status(404).json({ error: 'Chinhanh not found' });
    Object.assign(chinhanh, req.body);
    await chinhanh.save();
    res.json(chinhanh);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const chinhanh = await Chinhanh.findById(req.params.id);
    if (!chinhanh) return res.status(404).json({ error: 'Chinhanh not found' });
    await chinhanh.remove();
    res.json({ message: 'Chinhanh deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách chi nhánh của công ty hiện tại
router.get('/company/:congtyID', async (req, res) => {
  try {
    const { congtyID } = req.params;
    const chinhanh = await Chinhanh.find({ 
      congtyID: congtyID,
      trangthai: 'active' 
    }).sort({ ngaytao: -1 });
    res.json(chinhanh);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy chi nhánh mặc định của công ty (chi nhánh đầu tiên được tạo)
router.get('/company/:congtyID/default', async (req, res) => {
  try {
    const { congtyID } = req.params;
    let defaultBranch = await Chinhanh.findOne({ 
      congtyID: congtyID,
      trangthai: 'active' 
    }).sort({ ngaytao: 1 }); // Lấy chi nhánh tạo sớm nhất
    
    // Nếu chưa có chi nhánh nào, tạo chi nhánh mặc định
    if (!defaultBranch) {
      defaultBranch = new Chinhanh({
        ten: 'Chi nhánh chính',
        diachi: 'Địa chỉ mặc định',
        congtyID: congtyID,
        ngaytao: new Date(),
        trangthai: 'active'
      });
      await defaultBranch.save();
    }
    
    res.json(defaultBranch);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;