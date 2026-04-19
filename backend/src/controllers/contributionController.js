import Contribution from '../models/Contribution.js';

// @desc    Get all contributions
// @route   GET /api/contributions
// @access  Public
export const getAllContributions = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const contributions = await Contribution.find(query)
      .populate('contributor', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contributions,
      contributions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single contribution
// @route   GET /api/contributions/:id
// @access  Public
export const getContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('contributor', 'name profileImage bio');

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    res.status(200).json({
      success: true,
      data: contribution,
      contribution,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create contribution
// @route   POST /api/contributions
// @access  Private
export const createContribution = async (req, res) => {
  try {
    const { title, description, type, content, image, link, tags } = req.body;

    const contribution = await Contribution.create({
      title,
      description,
      type,
      content,
      image,
      link,
      tags,
      contributor: req.user.id,
    });

    const populatedContribution = await contribution.populate('contributor', 'name profileImage');

    res.status(201).json({
      success: true,
      contribution: populatedContribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contribution
// @route   PUT /api/contributions/:id
// @access  Private
export const updateContribution = async (req, res) => {
  try {
    let contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }

    // Check ownership
    if (contribution.contributor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update contribution',
      });
    }

    contribution = await Contribution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('contributor', 'name profileImage');

    res.status(200).json({
      success: true,
      contribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like contribution
// @route   POST /api/contributions/:id/like
// @access  Private
export const likeContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    if (contribution.likes.includes(req.user.id)) {
      contribution.likes = contribution.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      contribution.likes.push(req.user.id);
    }

    await contribution.save();

    res.status(200).json({
      success: true,
      contribution,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contribution
// @route   DELETE /api/contributions/:id
// @access  Private
export const deleteContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found' });
    }

    // Check ownership
    if (contribution.contributor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this contribution',
      });
    }

    await Contribution.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contribution deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
