const express = require('express');
const router = express.Router();
const SoDoCoThe = require('../models/SoDoCoThe');

router.get('/', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.find().populate('khachhangID userID');
    res.json(sodocothe);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/khachhang/:khachhangID', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.find({ khachhangID: req.params.khachhangID });
    res.json(sodocothe);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/personal/:userID', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.find({ userID: req.params.userID });
    res.json(sodocothe);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const sodocothe = new SoDoCoThe({
      ...req.body,
      ngaytao: new Date()
    });
    await sodocothe.save();
    res.status(201).json(sodocothe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sodocothe) return res.status(404).json({ error: 'Body measurement not found' });
    res.json(sodocothe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.findByIdAndDelete(req.params.id);
    if (!sodocothe) return res.status(404).json({ error: 'Body measurement not found' });
    res.json({ message: 'Body measurement deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/khachhang/:khachhangID', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.findOne({ khachhangID: req.params.khachhangID }).sort({ ngaytao: -1 });
    if (sodocothe) {
      await SoDoCoThe.updateMany(
        { khachhangID: req.params.khachhangID },
        {
          bophan: sodocothe.bophan.map(bp => ({
            ...bp,
            sodothangtruoc: bp.sodo,
            sodo: 0
          }))
        }
      );
    }
    res.json({ message: 'Monthly body measurement reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/personal/:userID', async (req, res) => {
  try {
    const sodocothe = await SoDoCoThe.findOne({ userID: req.params.userID }).sort({ ngaytao: -1 });
    if (sodocothe) {
      await SoDoCoThe.updateMany(
        { userID: req.params.userID },
        {
          bophan: sodocothe.bophan.map(bp => ({
            ...bp,
            sodothangtruoc: bp.sodo,
            sodo: 0
          }))
        }
      );
    }
    res.json({ message: 'Monthly body measurement reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;