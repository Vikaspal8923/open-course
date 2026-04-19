import express from 'express';
import {
  getAllContributions,
  getContribution,
  createContribution,
  updateContribution,
  deleteContribution,
  likeContribution,
} from '../controllers/contributionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllContributions);
router.get('/:id', getContribution);

router.post('/', protect, createContribution);
router.put('/:id', protect, updateContribution);
router.delete('/:id', protect, deleteContribution);
router.post('/:id/like', protect, likeContribution);

export default router;
