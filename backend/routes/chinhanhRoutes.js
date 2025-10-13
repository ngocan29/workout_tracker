import express from 'express';
import {
  getAllChinhanh,
  getChinhanhByCongty,
  createChinhanh,
  updateChinhanh,
  deleteChinhanh,
} from '../controllers/chinhanhController.js';

const router = express.Router();

router.get('/', getAllChinhanh);
router.get('/congty/:congtyID', getChinhanhByCongty);
router.post('/', createChinhanh);
router.put('/:id', updateChinhanh);
router.delete('/:id', deleteChinhanh);

export default router;
