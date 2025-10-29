const express = require('express');
const router = express.Router();
const Muctieu = require('../models/MucTieu');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const { userID } = req.query;
    let query = {};
    
    if (userID) {
      query.userID = userID;
    }
    
    const muctieu = await Muctieu.find(query);
    res.json(muctieu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userID) {
      return res.status(400).json({ error: 'userID is required' });
    }
    if (!req.body.muctieu) {
      return res.status(400).json({ error: 'muctieu is required' });
    }

    // Validate userID format
    if (!req.body.userID.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid userID format' });
    }

    const muctieu = new Muctieu({
      ...req.body,
      ngaytao: req.body.ngaytao || new Date(),
      tongthoigiantap: req.body.tongthoigiantap || 0,
      thongke: req.body.thongke || 0,
      thoigiantap: req.body.thoigiantap || 0
    });
    
    const newMuctieu = await muctieu.save();
    res.status(201).json(newMuctieu);
  } catch (err) {
    console.error('Error creating muctieu:', err);
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