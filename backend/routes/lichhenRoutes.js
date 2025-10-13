import express from 'express';
import {
  getAllLichhen,
  getLichhenByKhachhangAndNhanvien,
  createLichhen,
  updateLichhen,
  deleteLichhen
} from '../controllers/lichhenController.js';
import { protect } from '../middleware/authMiddleware.js'; // middleware xác thực JWT

const router = express.Router();

router.get('/', protect, getAllLichhen);
router.get('/khachhang/:khachhangID/nhanvien/:nhanvienID', protect, getLichhenByKhachhangAndNhanvien);
router.post('/', protect, createLichhen);
router.put('/:id', protect, updateLichhen);
router.delete('/:id', protect, deleteLichhen);

export default router;
