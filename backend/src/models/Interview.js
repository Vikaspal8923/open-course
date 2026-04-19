import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionsAsked: [{
      type: String,
    }],
    tipsAndAdvice: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    // Alternative fields for backward compatibility
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    interviewee: {
      name: String,
      title: String,
      bio: String,
      image: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    videoUrl: {
      type: String,
      default: null,
    },
    transcript: {
      type: String,
      default: '',
    },
    topics: [String],
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
