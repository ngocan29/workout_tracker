const express = require('express');
const router = express.Router();
const BaiTap = require('../models/BaiTap');

router.get('/', async (req, res) => {
  try {
    const baitap = await BaiTap.find().populate('khachhangID nhanvienID userID');
    res.json(baitap);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/khachhang/:khachhangID', async (req, res) => {
  try {
    const baitap = await BaiTap.find({ khachhangID: req.params.khachhangID }).populate('nhanvienID userID');
    res.json(baitap);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/personal/:userID', async (req, res) => {
  try {
    const baitap = await BaiTap.find({ userID: req.params.userID }).populate('nhanvienID khachhangID');
    res.json(baitap);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const baitap = new BaiTap({
      ...req.body,
      ngaytao: new Date(),
      ngaycapnhat: new Date(),
      thongke: 0
    });
    await baitap.save();
    res.status(201).json(baitap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const baitap = await BaiTap.findByIdAndUpdate(req.params.id, { ...req.body, ngaycapnhat: new Date() }, { new: true });
    if (!baitap) return res.status(404).json({ error: 'Exercise not found' });
    res.json(baitap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const baitap = await BaiTap.findByIdAndDelete(req.params.id);
    if (!baitap) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ message: 'Exercise deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;