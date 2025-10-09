const express = require('express');
const router = express.Router();
const MucTieu = require('../models/MucTieu');

router.get('/', async (req, res) => {
  try {
    const muctieu = await MucTieu.find().populate('baitapID khachhangID userID');
    res.json(muctieu);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/khachhang/:khachhangID', async (req, res) => {
  try {
    const muctieu = await MucTieu.find({ khachhangID: req.params.khachhangID }).populate('baitapID');
    res.json(muctieu);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/personal/:userID', async (req, res) => {
  try {
    const muctieu = await MucTieu.find({ userID: req.params.userID }).populate('baitapID');
    res.json(muctieu);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const muctieu = new MucTieu({
      ...req.body,
      ngaytao: new Date(),
      trangthai: 'dangtap'
    });
    await muctieu.save();
    res.status(201).json(muctieu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const muctieu = await MucTieu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!muctieu) return res.status(404).json({ error: 'Goal not found' });
    res.json(muctieu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const muctieu = await MucTieu.findByIdAndDelete(req.params.id);
    if (!muctieu) return res.status(404).json({ error: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/khachhang/:khachhangID', async (req, res) => {
  try {
    await MucTieu.updateMany(
      { khachhangID: req.params.khachhangID, ngaytao: { $gte: new Date().setHours(0,0,0,0) } },
      { thoigiantap: 0 }
    );
    res.json({ message: 'Daily goal reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/personal/:userID', async (req, res) => {
  try {
    await MucTieu.updateMany(
      { userID: req.params.userID, ngaytao: { $gte: new Date().setHours(0,0,0,0) } },
      { thoigiantap: 0 }
    );
    res.json({ message: 'Daily goal reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;