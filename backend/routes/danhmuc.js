const express = require('express');
const router = express.Router();
const Danhmuc = require('../models/DanhMuc');

router.get('/', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.find();
    res.json(danhmuc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const danhmuc = new Danhmuc(req.body);
  try {
    const newDanhmuc = await danhmuc.save();
    res.status(201).json(newDanhmuc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.findById(req.params.id);
    if (!danhmuc) return res.status(404).json({ error: 'Danhmuc not found' });
    res.json(danhmuc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.findById(req.params.id);
    if (!danhmuc) return res.status(404).json({ error: 'Danhmuc not found' });
    Object.assign(danhmuc, req.body);
    await danhmuc.save();
    res.json(danhmuc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const danhmuc = await Danhmuc.findById(req.params.id);
    if (!danhmuc) return res.status(404).json({ error: 'Danhmuc not found' });
    await danhmuc.remove();
    res.json({ message: 'Danhmuc deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;