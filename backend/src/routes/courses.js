import express from 'express';
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getInstructorCourses,
  likeCourse,
  dislikeCourse,
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/instructor/:id', getInstructorCourses);
router.get('/:id', getCourse);

router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/like', protect, likeCourse);
router.post('/:id/dislike', protect, dislikeCourse);

export default router;
