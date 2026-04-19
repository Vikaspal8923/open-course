import { Thread, Comment } from '../models/Thread.js';

// @desc    Get all threads
// @route   GET /api/threads
// @access  Public
export const getAllThreads = async (req, res) => {
  try {
    const { course, category, search } = req.query;
    let query = {};

    if (course) query.course = course;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const threads = await Thread.find(query)
      .populate('author', 'name profileImage')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profileImage',
        },
      })
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: threads,
      threads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single thread
// @route   GET /api/threads/:id
// @access  Public
export const getThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name profileImage bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profileImage',
        },
      })
      .populate('likes', 'name');

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    res.status(200).json({
      success: true,
      data: thread,
      thread,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create thread
// @route   POST /api/threads
// @access  Private
export const createThread = async (req, res) => {
  try {
    const { title, description, content, course, category, tags } = req.body;

    const thread = await Thread.create({
      title,
      description,
      content,
      course,
      category,
      tags,
      author: req.user.id,
    });

    const populatedThread = await thread.populate('author', 'name profileImage');

    res.status(201).json({
      success: true,
      thread: populatedThread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update thread
// @route   PUT /api/threads/:id
// @access  Private
export const updateThread = async (req, res) => {
  try {
    let thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check ownership
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update thread' });
    }

    thread = await Thread.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name profileImage');

    res.status(200).json({
      success: true,
      thread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete thread
// @route   DELETE /api/threads/:id
// @access  Private
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check ownership
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete thread' });
    }

    await Thread.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Thread deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to thread
// @route   POST /api/threads/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const comment = {
      author: req.user.id,
      content,
    };

    thread.comments.push(comment);
    await thread.save();

    const updatedThread = await thread.populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name profileImage',
      },
    });

    res.status(201).json({
      success: true,
      thread: updatedThread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like thread
// @route   POST /api/threads/:id/like
// @access  Private
export const likeThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    if (thread.likes.includes(req.user.id)) {
      thread.likes = thread.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      thread.likes.push(req.user.id);
    }

    await thread.save();

    res.status(200).json({
      success: true,
      thread,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
