import Course from '../models/Course.js';
import User from '../models/User.js';
import '../models/Material.js';

const toggleReaction = async (courseId, userId, reactionType) => {
  const course = await Course.findById(courseId);

  if (!course) {
    return null;
  }

  const targetField = reactionType === 'like' ? 'likes' : 'dislikes';
  const oppositeField = reactionType === 'like' ? 'dislikes' : 'likes';
  const hasReaction = course[targetField].some((entry) => entry.toString() === userId);

  course[oppositeField] = course[oppositeField].filter((entry) => entry.toString() !== userId);

  if (hasReaction) {
    course[targetField] = course[targetField].filter((entry) => entry.toString() !== userId);
  } else {
    course[targetField].push(userId);
  }

  await course.save();
  return course;
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name profileImage')
      .populate('lessons')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: courses,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profileImage bio')
      .populate({
        path: 'lessons',
        populate: {
          path: 'materials',
        },
      })
      .populate('materials');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      data: course,
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private
export const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      instructor: req.user.id,
      isPublished: true,
    });

    // Add to instructor's created courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id },
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Remove from instructor's created courses
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { createdCourses: course._id },
    });

    res.status(200).json({
      success: true,
      message: 'Course deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: course._id },
    });

    res.status(200).json({
      success: true,
      message: 'Enrolled successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor courses
// @route   GET /api/courses/instructor/:id
// @access  Public
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id })
      .populate('instructor', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on course
// @route   POST /api/courses/:id/like
// @access  Private
export const likeCourse = async (req, res) => {
  try {
    const course = await toggleReaction(req.params.id, req.user.id, 'like');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle dislike on course
// @route   POST /api/courses/:id/dislike
// @access  Private
export const dislikeCourse = async (req, res) => {
  try {
    const course = await toggleReaction(req.params.id, req.user.id, 'dislike');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
