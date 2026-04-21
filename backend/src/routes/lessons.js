import express from 'express';
import {
  getAllLessons,
  getLessonsByCourse,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  likeLesson,
  dislikeLesson,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllLessons);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLesson);

router.post('/', protect, createLesson);
router.put('/:id', protect, updateLesson);
router.delete('/:id', protect, deleteLesson);
router.post('/:id/like', protect, likeLesson);
router.post('/:id/dislike', protect, dislikeLesson);

export default router;
