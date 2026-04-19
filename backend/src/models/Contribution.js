import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a contribution title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    contributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Course', 'Article', 'Resource', 'Tool', 'Research'],
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
    tags: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Contribution = mongoose.model('Contribution', contributionSchema);

export default Contribution;
