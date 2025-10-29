const express = require('express');
const router = express.Router();
const Sodocothe = require('../models/SoDoCoThe');
const mongoose = require('mongoose');

// Thêm số đo mới cho user cụ thể
router.post('/user/:userId', async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.params.userId);

    const sodocothe = new Sodocothe({
      userID: userObjectId, //gắn userId từ param
      bophan: req.body.bophan, //danh sách bộ phận đo
      ngaytao: req.body.ngaytao || new Date()
    });

    const newSodocothe = await sodocothe.save();
    res.status(201).json(newSodocothe);
  } catch (err) {
    console.error('Lỗi khi thêm số đo:', err);
    res.status(400).json({ error: err.message });
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const sodocothe = await Sodocothe.find({ userID: req.params.userId }).sort({ ngaytao: -1 });
    res.json(sodocothe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sodocothe = await Sodocothe.find();
    res.json(sodocothe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const sodocothe = new Sodocothe({
    ...req.body,
    ngaytao: req.body.ngaytao || new Date()
  });
  try {
    const newSodocothe = await sodocothe.save();
    res.status(201).json(newSodocothe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sodocothe = await Sodocothe.find({ userId: req.params.userId });
    if (!sodocothe) return res.status(404).json({ error: 'Sodocothe not found' });
    res.json(sodocothe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sodocothe = await Sodocothe.find({ userId: req.params.userId });
    if (!sodocothe) return res.status(404).json({ error: 'Sodocothe not found' });
    Object.assign(sodocothe, req.body);
    await sodocothe.save();
    res.json(sodocothe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sodocothe = await Sodocothe.find({ userId: req.params.userId });
    if (!sodocothe) return res.status(404).json({ error: 'Sodocothe not found' });
    await sodocothe.remove();
    res.json({ message: 'Sodocothe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;