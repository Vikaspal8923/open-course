import express from 'express';
import {
  getAllInterviews,
  getInterview,
  createInterview,
  updateInterview,
  likeInterview,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllInterviews);
router.get('/:id', getInterview);

router.post('/', protect, createInterview);
router.put('/:id', protect, updateInterview);
router.post('/:id/like', protect, likeInterview);

export default router;
