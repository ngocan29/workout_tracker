const express = require('express');
const router = express.Router();
const Dinhduong = require('../models/DinhDuong');
const User = require('../models/User');

// GET: Lấy dinh dưỡng của khách hàng (mới nhất)
router.get('/', async (req, res) => {
  try {
    const { khachhangUserID } = req.query;
    if (!khachhangUserID) return res.status(400).json({ error: 'Thiếu khachhangUserID' });

    const dinhduong = await Dinhduong.find({ khachhangUserID })
      .sort({ ngaytao: -1 })
      .limit(1);

    res.json(dinhduong[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Tạo mới + tính toán luongnuoc
router.post('/', async (req, res) => {
  try {
    const {
      khachhangUserID,
      userID,
      chieucao,
      cannang,
      calo = 0,
      nuocDaUong = 0,
    } = req.body;

    if (!khachhangUserID || !chieucao || !cannang) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Tính lượng nước cần uống (L)
    const luongnuoc = ((cannang * 30) + (chieucao * 10)) / 1000;

    const dinhduong = new Dinhduong({
      khachhangUserID,
      userID: userID || null,
      chieucao: Number(chieucao),
      cannang: Number(cannang),
      luongnuoc: Number(luongnuoc.toFixed(2)),
      calo: Number(calo),
      ngaytao: new Date(),
    });

    const saved = await dinhduong.save(); // pre-save sẽ tính BMI, LBM
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Cập nhật nước đã uống
router.put('/:id', async (req, res) => {
  try {
    const { nuocDaUong } = req.body;
    const dinhduong = await Dinhduong.findById(req.params.id);
    if (!dinhduong) return res.status(404).json({ error: 'Not found' });

    // Không thay đổi luongnuoc, chỉ cập nhật calo nếu cần
    if (nuocDaUong !== undefined) {
      dinhduong.calo = Number(nuocDaUong) * 1000; // giả sử 1L = 1000 calo (tạm)
    }
    await dinhduong.save();
    res.json(dinhduong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;