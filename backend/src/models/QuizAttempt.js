const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOption: {
    type: Number,
    min: 0,
    max: 3
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  marksObtained: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  }
});

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'timed_out'],
    default: 'in_progress'
  },
  rank: {
    type: Number
  },
  isPassed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

quizAttemptSchema.methods.calculateScore = function() {
  let totalMarks = 0;
  
  this.answers.forEach(answer => {
    if (answer.isCorrect) {
      answer.marksObtained = 1;
      totalMarks += 1;
    } else if (answer.selectedOption !== undefined) {
      answer.marksObtained = -0.25;
      totalMarks -= 0.25;
    } else {
      answer.marksObtained = 0;
    }
  });
  
  this.totalMarks = Math.max(0, totalMarks);
  this.percentage = (this.totalMarks / this.answers.length) * 100;
  
  return this.totalMarks;
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);