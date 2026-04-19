import express from 'express';
import {
  getAllThreads,
  getThread,
  createThread,
  updateThread,
  deleteThread,
  addComment,
  likeThread,
} from '../controllers/threadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllThreads);
router.get('/:id', getThread);

router.post('/', protect, createThread);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);

router.post('/:id/comments', protect, addComment);
router.post('/:id/like', protect, likeThread);

export default router;
