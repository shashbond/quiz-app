const express = require('express');
const { body } = require('express-validator');
const {
  startQuiz,
  submitAnswer,
  finishQuiz,
  getAttempt,
  getUserAttempts
} = require('../controllers/quizAttemptController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const submitAnswerValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('selectedOption').isInt({ min: 0, max: 3 }).withMessage('Selected option must be between 0 and 3')
];

router.post('/:quizId/start', authenticateToken, startQuiz);
router.post('/:attemptId/answer', authenticateToken, submitAnswerValidation, submitAnswer);
router.post('/:attemptId/finish', authenticateToken, finishQuiz);
router.get('/:attemptId', authenticateToken, getAttempt);
router.get('/user/attempts', authenticateToken, getUserAttempts);

module.exports = router;