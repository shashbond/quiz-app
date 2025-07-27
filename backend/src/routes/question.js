const express = require('express');
const { body } = require('express-validator');
const {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  uploadDocument,
  upload
} = require('../controllers/questionController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const questionValidation = [
  body('questionText').notEmpty().withMessage('Question text is required'),
  body('options').isArray({ min: 4, max: 4 }).withMessage('Must have exactly 4 options'),
  body('options.*.text').notEmpty().withMessage('Option text is required'),
  body('marks').isNumeric().withMessage('Marks must be a number'),
  body('negativeMarks').isNumeric().withMessage('Negative marks must be a number')
];

router.post('/:quizId/questions', authenticateToken, requireAdmin, questionValidation, createQuestion);
router.get('/:quizId/questions', authenticateToken, getQuestions);
router.put('/questions/:questionId', authenticateToken, requireAdmin, updateQuestion);
router.delete('/questions/:questionId', authenticateToken, requireAdmin, deleteQuestion);
router.post('/upload', authenticateToken, requireAdmin, upload.single('document'), uploadDocument);

module.exports = router;