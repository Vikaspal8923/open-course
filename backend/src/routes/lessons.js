import express from 'express';
import {
  getAllLessons,
  getLessonsByCourse,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllLessons);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLesson);

router.post('/', protect, createLesson);
router.put('/:id', protect, updateLesson);
router.delete('/:id', protect, deleteLesson);

export default router;
