const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { validationResult } = require('express-validator');

const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isActive || new Date() < quiz.startDate || new Date() > quiz.endDate) {
      return res.status(403).json({ message: 'Quiz not available' });
    }

    if (!quiz.allowMultipleAttempts) {
      const existingAttempt = await QuizAttempt.findOne({
        quiz: quizId,
        participant: req.user._id
      });
      
      if (existingAttempt) {
        return res.status(400).json({ message: 'You have already attempted this quiz' });
      }
    }

    const questions = await Question.find({ quiz: quizId, isActive: true })
      .select('_id')
      .sort({ order: 1, createdAt: 1 });

    const attempt = new QuizAttempt({
      quiz: quizId,
      participant: req.user._id,
      answers: questions.map(q => ({
        question: q._id,
        selectedOption: undefined,
        isCorrect: false,
        marksObtained: 0,
        timeSpent: 0
      }))
    });

    await attempt.save();

    res.status(201).json({
      message: 'Quiz started successfully',
      attemptId: attempt._id,
      duration: quiz.duration,
      startTime: attempt.startTime
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ message: 'Server error starting quiz' });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedOption, timeSpent } = req.body;

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.participant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ message: 'Quiz attempt is not in progress' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answerIndex = attempt.answers.findIndex(
      ans => ans.question.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(400).json({ message: 'Question not part of this attempt' });
    }

    const isCorrect = question.options[selectedOption]?.isCorrect || false;
    
    attempt.answers[answerIndex] = {
      question: questionId,
      selectedOption,
      isCorrect,
      marksObtained: isCorrect ? 1 : (selectedOption !== undefined ? -0.25 : 0),
      timeSpent: timeSpent || 0
    };

    await attempt.save();

    res.json({
      message: 'Answer submitted successfully',
      isCorrect,
      marksObtained: attempt.answers[answerIndex].marksObtained
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Server error submitting answer' });
  }
};

const finishQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    const attempt = await QuizAttempt.findById(attemptId)
      .populate('quiz', 'title totalQuestions passingMarks showResults')
      .populate('participant', 'firstName lastName');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.participant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ message: 'Quiz attempt already finished' });
    }

    attempt.endTime = new Date();
    attempt.duration = Math.round((attempt.endTime - attempt.startTime) / 1000);
    attempt.status = 'completed';
    
    const totalMarks = attempt.calculateScore();
    attempt.isPassed = totalMarks >= attempt.quiz.passingMarks;

    await attempt.save();

    const rank = await QuizAttempt.countDocuments({
      quiz: attempt.quiz._id,
      status: 'completed',
      totalMarks: { $gt: totalMarks }
    }) + 1;

    attempt.rank = rank;
    await attempt.save();

    const response = {
      message: 'Quiz completed successfully',
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      rank,
      duration: attempt.duration
    };

    if (attempt.quiz.showResults) {
      response.answers = attempt.answers;
    }

    res.json(response);
  } catch (error) {
    console.error('Finish quiz error:', error);
    res.status(500).json({ message: 'Server error finishing quiz' });
  }
};

const getAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    const attempt = await QuizAttempt.findById(attemptId)
      .populate('quiz', 'title duration')
      .populate('participant', 'firstName lastName')
      .populate('answers.question', 'questionText options explanation');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.participant._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ attempt });
  } catch (error) {
    console.error('Get attempt error:', error);
    res.status(500).json({ message: 'Server error fetching attempt' });
  }
};

const getUserAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const attempts = await QuizAttempt.find({ participant: req.user._id })
      .populate('quiz', 'title totalQuestions')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QuizAttempt.countDocuments({ participant: req.user._id });

    res.json({
      attempts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({ message: 'Server error fetching attempts' });
  }
};

module.exports = {
  startQuiz,
  submitAnswer,
  finishQuiz,
  getAttempt,
  getUserAttempts
};