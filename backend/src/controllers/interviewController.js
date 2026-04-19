import Interview from '../models/Interview.js';
import User from '../models/User.js';

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Public
export const getAllInterviews = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { 'interviewee.name': { $regex: search, $options: 'i' } },
      ];
    }

    const interviews = await Interview.find(query)
      .populate('author', 'name profileImage')
      .populate('course', 'title')
      .populate('likes', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profileImage',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Public
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name profileImage')
      .populate('course', 'title')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profileImage',
        },
      })
      .populate('likes', 'name');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({
      success: true,
      data: interview,
      interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create interview
// @route   POST /api/interviews
// @access  Private
export const createInterview = async (req, res) => {
  try {
    const { company, questionsAsked, tipsAndAdvice, difficulty, title, description, interviewee, videoUrl, transcript, topics, duration } = req.body;
    const normalizedCompany = company || title || 'Untitled Interview';

    // Handle both new format (company-based) and old format (title-based)
    const interviewData = {
      company: normalizedCompany,
      author: req.user.id,
      questionsAsked: questionsAsked || [],
      tipsAndAdvice: tipsAndAdvice || description || '',
      difficulty: difficulty || 'Medium',
      isPublished: true,
      ...(title && { title }),
      ...(interviewee && { interviewee }),
      ...(videoUrl && { videoUrl }),
      ...(transcript && { transcript }),
      ...(topics && { topics }),
      ...(duration && { duration }),
    };

    const interview = await Interview.create(interviewData);

    const populatedInterview = await interview.populate([
      { path: 'author', select: 'name profileImage' },
      { path: 'course', select: 'title' },
    ]);

    res.status(201).json({
      success: true,
      interview: populatedInterview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
export const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like interview
// @route   POST /api/interviews/:id/like
// @access  Private
export const likeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.likes.includes(req.user.id)) {
      interview.likes = interview.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      interview.likes.push(req.user.id);
    }

    await interview.save();

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
