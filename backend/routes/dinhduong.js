const express = require('express');
const router = express.Router();
const Dinhduong = require('../models/DinhDuong');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const dinhduong = await Dinhduong.find();
    res.json(dinhduong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const dinhduong = new Dinhduong({
    ...req.body,
    ngaytao: req.body.ngaytao || new Date()
  });
  try {
    const newDinhduong = await dinhduong.save();
    res.status(201).json(newDinhduong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dinhduong = await Dinhduong.findById(req.params.id);
    if (!dinhduong) return res.status(404).json({ error: 'Dinhduong not found' });
    res.json(dinhduong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const dinhduong = await Dinhduong.findById(req.params.id);
    if (!dinhduong) return res.status(404).json({ error: 'Dinhduong not found' });
    Object.assign(dinhduong, req.body);
    await dinhduong.save();
    res.json(dinhduong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dinhduong = await Dinhduong.findById(req.params.id);
    if (!dinhduong) return res.status(404).json({ error: 'Dinhduong not found' });
    await dinhduong.remove();
    res.json({ message: 'Dinhduong deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;