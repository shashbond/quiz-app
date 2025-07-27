const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { validationResult } = require('express-validator');
const mammoth = require('mammoth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|docx|doc|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

const createQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const question = new Question({
      ...req.body,
      quiz: quizId
    });

    await question.save();

    await Quiz.findByIdAndUpdate(quizId, {
      $inc: { 
        totalQuestions: 1,
        totalMarks: question.marks
      }
    });

    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error creating question' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (req.user.role === 'participant') {
      if (!quiz.isActive || new Date() < quiz.startDate || new Date() > quiz.endDate) {
        return res.status(403).json({ message: 'Quiz not available' });
      }
    }

    const questions = await Question.find({ quiz: quizId, isActive: true })
      .select(req.user.role === 'participant' ? '-options.isCorrect -explanation' : '')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ order: 1, createdAt: 1 });

    const total = await Question.countDocuments({ quiz: quizId, isActive: true });

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId).populate('quiz');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(question, req.body);
    await question.save();

    res.json({ message: 'Question updated successfully', question });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error updating question' });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId).populate('quiz');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Question.findByIdAndDelete(questionId);

    await Quiz.findByIdAndUpdate(question.quiz._id, {
      $inc: { 
        totalQuestions: -1,
        totalMarks: -question.marks
      }
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error deleting question' });
  }
};

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (path.extname(req.file.originalname).toLowerCase() === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      const text = result.value;
      
      const questions = parseQuestionsFromText(text);
      
      res.json({
        message: 'Document processed successfully',
        questions,
        filename: req.file.filename
      });
    } else {
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error uploading file' });
  }
};

const parseQuestionsFromText = (text) => {
  const questions = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  let currentQuestion = null;
  let optionIndex = 0;
  
  for (let line of lines) {
    line = line.trim();
    
    if (line.match(/^\d+\./)) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        questionText: line.replace(/^\d+\./, '').trim(),
        options: [],
        explanation: ''
      };
      optionIndex = 0;
    } else if (line.match(/^[a-d]\)/i) && currentQuestion) {
      const isCorrect = line.toLowerCase().includes('*') || line.toLowerCase().includes('correct');
      currentQuestion.options.push({
        text: line.replace(/^[a-d]\)/i, '').replace(/\*/g, '').trim(),
        isCorrect
      });
      optionIndex++;
    }
  }
  
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return questions.filter(q => q.options.length === 4);
};

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  uploadDocument,
  upload
};