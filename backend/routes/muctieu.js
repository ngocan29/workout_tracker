const express = require('express');
const router = express.Router();
const Muctieu = require('../models/MucTieu');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const muctieu = await Muctieu.find();
    res.json(muctieu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const muctieu = new Muctieu({
    ...req.body,
    ngaytao: req.body.ngaytao || new Date(),
    tongthoigiantap: req.body.tongthoigiantap || 0,
    thongke: req.body.thongke || 0
  });
  try {
    const newMuctieu = await muctieu.save();
    res.status(201).json(newMuctieu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const muctieu = await Muctieu.findById(req.params.id);
    if (!muctieu) return res.status(404).json({ error: 'Muctieu not found' });
    res.json(muctieu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const muctieu = await Muctieu.findById(req.params.id);
    if (!muctieu) return res.status(404).json({ error: 'Muctieu not found' });
    if (req.body.thoigiantap) {
      muctieu.tongthoigiantap += req.body.thoigiantap;
      muctieu.thongke = muctieu.tongthoigiantap;
    }
    if (req.body.trangthai) {
      const user = await User.findById(muctieu.khachhangUserID || muctieu.userID);
      if (req.body.trangthai === 'hoanthanh') {
        user.chuoi += 1;
      } else if (req.body.trangthai === 'thatbai') {
        user.chuoi = 0;
      }
      await user.save();
    }
    Object.assign(muctieu, req.body);
    await muctieu.save();
    res.json(muctieu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const muctieu = await Muctieu.findById(req.params.id);
    if (!muctieu) return res.status(404).json({ error: 'Muctieu not found' });
    await muctieu.remove();
    res.json({ message: 'Muctieu deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;