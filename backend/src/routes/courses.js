import express from 'express';
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getInstructorCourses,
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

export default router;
