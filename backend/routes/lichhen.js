const express = require('express');
const router = express.Router();
const Lichhen = require('../models/LichHen');

router.get('/', async (req, res) => {
  try {
    const lichhen = await Lichhen.find();
    res.json(lichhen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const lichhen = new Lichhen({
    ...req.body,
    ngaytao: req.body.ngaytao || new Date(),
    trangthai: req.body.trangthai || 'chualichhen'
  });
  try {
    const newLichhen = await lichhen.save();
    res.status(201).json(newLichhen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lichhen = await Lichhen.findById(req.params.id);
    if (!lichhen) return res.status(404).json({ error: 'Lichhen not found' });
    res.json(lichhen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const lichhen = await Lichhen.findById(req.params.id);
    if (!lichhen) return res.status(404).json({ error: 'Lichhen not found' });
    Object.assign(lichhen, req.body);
    await lichhen.save();
    res.json(lichhen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const lichhen = await Lichhen.findById(req.params.id);
    if (!lichhen) return res.status(404).json({ error: 'Lichhen not found' });
    await lichhen.remove();
    res.json({ message: 'Lichhen deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;