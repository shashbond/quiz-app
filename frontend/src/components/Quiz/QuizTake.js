import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import { Timer, NavigateNext, NavigateBefore, CheckCircle } from '@mui/icons-material';
import { useTimer } from 'react-timer-hook';
import axios from 'axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [error, setError] = useState('');

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 0);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => handleTimeUp(),
    autoStart: false
  });

  useEffect(() => {
    initializeQuiz();
  }, [id]);

  const initializeQuiz = async () => {
    try {
      const quizResponse = await axios.get(`/api/quiz/${id}`);
      const quiz = quizResponse.data.quiz;
      setQuiz(quiz);

      const questionsResponse = await axios.get(`/api/quiz/${id}/questions`);
      setQuestions(questionsResponse.data.questions);

      const startResponse = await axios.post(`/api/attempt/${id}/start`);
      setAttemptId(startResponse.data.attemptId);

      const newExpiryTime = new Date();
      newExpiryTime.setSeconds(newExpiryTime.getSeconds() + quiz.duration * 60);
      restart(newExpiryTime, true);

      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load quiz');
      setLoading(false);
    }
  };

  const handleAnswerChange = async (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption
    });

    try {
      await axios.post(`/api/attempt/${attemptId}/answer`, {
        questionId,
        selectedOption: parseInt(selectedOption),
        timeSpent: 30
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleTimeUp = () => {
    finishQuiz();
  };

  const finishQuiz = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(`/api/attempt/${attemptId}/finish`);
      navigate(`/quiz/${id}/results`, { 
        state: { results: response.data } 
      });
    } catch (error) {
      setError('Failed to submit quiz');
    }
    setSubmitting(false);
  };

  const formatTime = () => {
    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return <LoadingSpinner message="Loading quiz..." />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">{quiz?.title}</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={<CheckCircle />}
                label={`${getAnsweredCount()}/${questions.length} Answered`}
                color={getAnsweredCount() === questions.length ? 'success' : 'default'}
              />
              <Chip
                icon={<Timer />}
                label={formatTime()}
                color={minutes < 5 ? 'error' : 'primary'}
                variant="outlined"
              />
            </Box>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </CardContent>
      </Card>

      {currentQuestion && (
        <Card>
          <CardContent>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentQuestion.questionText}
              </Typography>
              
              {currentQuestion.media && (
                <Box mb={2}>
                  {currentQuestion.media.type === 'image' && (
                    <img
                      src={currentQuestion.media.url}
                      alt="Question media"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                  {currentQuestion.media.type === 'video' && (
                    <video
                      controls
                      style={{ maxWidth: '100%', height: 'auto' }}
                    >
                      <source src={currentQuestion.media.url} />
                    </video>
                  )}
                </Box>
              )}

              <RadioGroup
                value={answers[currentQuestion._id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option.text}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                startIcon={<NavigateBefore />}
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <Typography variant="body2" color="textSecondary">
                {currentQuestionIndex + 1} / {questions.length}
              </Typography>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  endIcon={<NavigateNext />}
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  variant="contained"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setShowFinishDialog(true)}
                >
                  Finish Quiz
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog open={showFinishDialog} onClose={() => setShowFinishDialog(false)}>
        <DialogTitle>Finish Quiz</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to finish the quiz? You have answered {getAnsweredCount()} out of {questions.length} questions.
          </Typography>
          {getAnsweredCount() < questions.length && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You haven't answered all questions. Unanswered questions will be marked as incorrect.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinishDialog(false)}>
            Continue Quiz
          </Button>
          <Button
            onClick={finishQuiz}
            variant="contained"
            color="success"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Finish Quiz'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizTake;