const express = require('express');
const { body } = require('express-validator');
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getLeaderboard
} = require('../controllers/quizController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const quizValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('passingMarks').isNumeric().withMessage('Passing marks must be a number')
];

router.post('/', authenticateToken, requireAdmin, quizValidation, createQuiz);
router.get('/', authenticateToken, getAllQuizzes);
router.get('/:id', authenticateToken, getQuizById);
router.put('/:id', authenticateToken, requireAdmin, updateQuiz);
router.delete('/:id', authenticateToken, requireAdmin, deleteQuiz);
router.get('/:quizId/leaderboard', authenticateToken, getLeaderboard);

module.exports = router;