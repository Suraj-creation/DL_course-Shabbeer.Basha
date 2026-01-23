const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  tutorialNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  briefSummary: {
    type: String,
    maxlength: 300
  },
  learningObjectives: [{
    type: String
  }],
  topicsCovered: [{
    type: String
  }],
  coveredInLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  whyItMatters: {
    type: String
  },
  videos: [{
    title: String,
    url: String,
    duration: String
  }],
  slides: [{
    title: String,
    url: String,
    fileName: String
  }],
  practiceProblems: [{
    title: String,
    url: String,
    solutionsUrl: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

TutorialSchema.index({ courseId: 1, tutorialNumber: 1 });

module.exports = mongoose.model('Tutorial', TutorialSchema);
