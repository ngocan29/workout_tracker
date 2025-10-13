import express from 'express';
import {
  getAllBaitap,
  getBaitapByKhachhang,
  getBaitapByCongty,
  getBaitapByPersonal,
  createBaitap,
  updateBaitap,
  deleteBaitap,
  resetTrangthai
} from '../controllers/baitapController.js';

const router = express.Router();

router.get('/', getAllBaitap);
router.get('/khachhang/:khachhangID', getBaitapByKhachhang);
router.get('/congty/:congtyID', getBaitapByCongty);
router.get('/personal/:userID', getBaitapByPersonal);

router.post('/', createBaitap);
router.put('/:id', updateBaitap);
router.delete('/:id', deleteBaitap);

// reset trạng thái
router.put('/trangthai/baitap/:baitapID/khachhang/:khachhangID', resetTrangthai);

export default router;
