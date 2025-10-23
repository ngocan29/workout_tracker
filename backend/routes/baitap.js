const express = require('express');
const router = express.Router();
const Baitap = require('../models/BaiTap');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const baitap = await Baitap.find();
    res.json(baitap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const baitap = new Baitap({
    ...req.body,
    ngaytao: req.body.ngaytao || new Date(),
    thongke: req.body.thongke || 0,
    trangthai: req.body.trangthai || 'chuahoanthanh'
  });
  try {
    const newBaitap = await baitap.save();
    res.status(201).json(newBaitap);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const baitap = await Baitap.findById(req.params.id);
    if (!baitap) return res.status(404).json({ error: 'Baitap not found' });
    res.json(baitap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const baitap = await Baitap.findById(req.params.id);
    if (!baitap) return res.status(404).json({ error: 'Baitap not found' });
    if (req.body.trangthai === 'hoanthanh' && baitap.trangthai !== 'hoanthanh') {
      baitap.thongke += 1;
      if (baitap.khachhangUserID) {
        const user = await User.findById(baitap.khachhangUserID);
        user.diemthuong += 10;
        await user.save();
      }
    }
    Object.assign(baitap, req.body);
    baitap.ngaycapnhat = new Date();
    await baitap.save();
    res.json(baitap);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const baitap = await Baitap.findById(req.params.id);
    if (!baitap) return res.status(404).json({ error: 'Baitap not found' });
    await baitap.remove();
    res.json({ message: 'Baitap deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;