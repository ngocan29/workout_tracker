const express = require('express');
const router = express.Router();
const Sodocothe = require('../models/SoDoCoThe');

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
    const sodocothe = await Sodocothe.findById(req.params.id);
    if (!sodocothe) return res.status(404).json({ error: 'Sodocothe not found' });
    res.json(sodocothe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sodocothe = await Sodocothe.findById(req.params.id);
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
    const sodocothe = await Sodocothe.findById(req.params.id);
    if (!sodocothe) return res.status(404).json({ error: 'Sodocothe not found' });
    await sodocothe.remove();
    res.json({ message: 'Sodocothe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;