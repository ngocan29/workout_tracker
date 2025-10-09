const express = require('express');
const router = express.Router();
const LichHen = require('../models/LichHen');

router.get('/', async (req, res) => {
  try {
    const lichhen = await LichHen.find().populate('khachhangID nhanvienID');
    res.json(lichhen);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/khachhang/:khachhangID', async (req, res) => {
  try {
    const lichhen = await LichHen.find({ khachhangID: req.params.khachhangID }).populate('nhanvienID');
    res.json(lichhen);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/nhanvien/:nhanvienID', async (req, res) => {
  try {
    const lichhen = await LichHen.find({ nhanvienID: req.params.nhanvienID }).populate('khachhangID');
    res.json(lichhen);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const lichhen = new LichHen({
      ...req.body,
      ngaytao: new Date(),
      trangthai: 'chualichhen'
    });
    await lichhen.save();
    res.status(201).json(lichhen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const lichhen = await LichHen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lichhen) return res.status(404).json({ error: 'Appointment not found' });
    res.json(lichhen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const lichhen = await LichHen.findByIdAndDelete(req.params.id);
    if (!lichhen) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;