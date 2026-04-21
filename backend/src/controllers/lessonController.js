import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import '../models/Material.js';

const lessonPopulate = [
  { path: 'materials' },
  { path: 'createdBy', select: 'name email profileImage role' },
];

const toggleReaction = async (lessonId, userId, reactionType) => {
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    return null;
  }

  const targetField = reactionType === 'like' ? 'likes' : 'dislikes';
  const oppositeField = reactionType === 'like' ? 'dislikes' : 'likes';
  const hasReaction = lesson[targetField].some((entry) => entry.toString() === userId);

  lesson[oppositeField] = lesson[oppositeField].filter((entry) => entry.toString() !== userId);

  if (hasReaction) {
    lesson[targetField] = lesson[targetField].filter((entry) => entry.toString() !== userId);
  } else {
    lesson[targetField].push(userId);
  }

  await lesson.save();
  return lesson.populate(lessonPopulate);
};

const canUpdateLesson = (lesson, user) => {
  if (!lesson || !user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  return lesson.createdBy?.toString() === user.id;
};

const canDeleteLesson = (lesson, course, user) => {
  if (!lesson || !user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  if (lesson.createdBy?.toString() === user.id) {
    return true;
  }

  return course?.instructor?.toString() === user.id;
};

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Public
export const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate(lessonPopulate)
      .populate('course', 'title instructor')
      .sort({ createdAt: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: lessons,
      lessons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .populate(lessonPopulate)
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: lessons,
      lessons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate(lessonPopulate)
      .populate('course', 'title instructor');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({
      success: true,
      data: lesson,
      lesson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private
export const createLesson = async (req, res) => {
  try {
    const { title, description, content, videoUrl, duration, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = await Lesson.create({
      title,
      description,
      content,
      videoUrl,
      duration,
      course: courseId,
      createdBy: req.user.id,
      order: order || 1,
      isPublished: true,
    });

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private
export const updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);

    // Check ownership
    if (!canUpdateLesson(lesson, req.user)) {
      return res.status(403).json({ message: 'Not authorized to update lesson' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(lessonPopulate);

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);

    // Check ownership
    if (!canDeleteLesson(lesson, course, req.user)) {
      return res.status(403).json({ message: 'Not authorized to delete lesson' });
    }

    await Lesson.findByIdAndDelete(req.params.id);

    // Remove from course
    course.lessons = course.lessons.filter((l) => l.toString() !== req.params.id);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on lesson
// @route   POST /api/lessons/:id/like
// @access  Private
export const likeLesson = async (req, res) => {
  try {
    const lesson = await toggleReaction(req.params.id, req.user.id, 'like');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle dislike on lesson
// @route   POST /api/lessons/:id/dislike
// @access  Private
export const dislikeLesson = async (req, res) => {
  try {
    const lesson = await toggleReaction(req.params.id, req.user.id, 'dislike');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
