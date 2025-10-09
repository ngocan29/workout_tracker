const express = require('express');
const router = express.Router();
const DinhDuong = require('../models/DinhDuong');

router.get('/', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.find().populate('khachhangID userID');
    res.json(dinhduong);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/khachhang/:khachhangID', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.find({ khachhangID: req.params.khachhangID });
    res.json(dinhduong);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/personal/:userID', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.find({ userID: req.params.userID });
    res.json(dinhduong);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { chieucao, cannang } = req.body;
    const bmi = cannang / ((chieucao / 100) ** 2);
    const lbm = 0.407 * cannang + 0.267 * chieucao - 19.2; // Example LBM calculation
    const dinhduong = new DinhDuong({
      ...req.body,
      bmi,
      lbm,
      ngaytao: new Date()
    });
    await dinhduong.save();
    res.status(201).json(dinhduong);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dinhduong) return res.status(404).json({ error: 'Nutrition not found' });
    res.json(dinhduong);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.findByIdAndDelete(req.params.id);
    if (!dinhduong) return res.status(404).json({ error: 'Nutrition not found' });
    res.json({ message: 'Nutrition deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/khachhang/:khachhangID', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.findOne({ khachhangID: req.params.khachhangID }).sort({ ngaytao: -1 });
    if (dinhduong) {
      await DinhDuong.updateMany(
        { khachhangID: req.params.khachhangID },
        {
          chieucaothangtruoc: dinhduong.chieucao,
          cannangthangtruoc: dinhduong.cannang,
          chieucao: 0,
          cannang: 0,
          luongnuoc: 0,
          calo: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          bmi: 0,
          lbm: 0
        }
      );
    }
    res.json({ message: 'Monthly nutrition reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/personal/:userID', async (req, res) => {
  try {
    const dinhduong = await DinhDuong.findOne({ userID: req.params.userID }).sort({ ngaytao: -1 });
    if (dinhduong) {
      await DinhDuong.updateMany(
        { userID: req.params.userID },
        {
          chieucaothangtruoc: dinhduong.chieucao,
          cannangthangtruoc: dinhduong.cannang,
          chieucao: 0,
          cannang: 0,
          luongnuoc: 0,
          calo: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          bmi: 0,
          lbm: 0
        }
      );
    }
    res.json({ message: 'Monthly nutrition reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;