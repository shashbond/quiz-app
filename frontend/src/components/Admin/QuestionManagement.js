import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Fab,
  Alert
} from '@mui/material';
import { Add, Edit, Delete, Upload, CloudUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const QuestionManagement = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: '',
    marks: 1,
    negativeMarks: 0.25,
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchQuestions();
    fetchQuizDetails();
  }, [id]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}/questions`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}`);
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      explanation: '',
      marks: 1,
      negativeMarks: 0.25,
      difficulty: 'medium'
    });
    setOpenDialog(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: question.options,
      explanation: question.explanation || '',
      marks: question.marks,
      negativeMarks: question.negativeMarks,
      difficulty: question.difficulty
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const correctAnswers = formData.options.filter(opt => opt.isCorrect).length;
      if (correctAnswers !== 1) {
        alert('Please select exactly one correct answer');
        return;
      }

      if (editingQuestion) {
        await axios.put(`/api/quiz/questions/${editingQuestion._id}`, formData);
      } else {
        await axios.post(`/api/quiz/${id}/questions`, formData);
      }
      
      setOpenDialog(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`/api/quiz/questions/${questionId}`);
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect' && value) {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('/api/quiz/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.questions) {
        for (const questionData of response.data.questions) {
          await axios.post(`/api/quiz/${id}/questions`, questionData);
        }
        setOpenUploadDialog(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1
  });

  if (loading) {
    return <LoadingSpinner message="Loading questions..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">Question Management</Typography>
          {quiz && (
            <Typography variant="h6" color="textSecondary">
              {quiz.title}
            </Typography>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => setOpenUploadDialog(true)}
            sx={{ mr: 2 }}
          >
            Upload Document
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateQuestion}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          {questions.length > 0 ? (
            <List>
              {questions.map((question, index) => (
                <ListItem key={question._id} divider>
                  <ListItemText
                    primary={`${index + 1}. ${question.questionText}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Options: {question.options.map((opt, i) => 
                            `${String.fromCharCode(65 + i)}) ${opt.text}`
                          ).join(' | ')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Correct: {String.fromCharCode(65 + question.options.findIndex(opt => opt.isCorrect))}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box>
                    <IconButton
                      onClick={() => handleEditQuestion(question)}
                      title="Edit Question"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteQuestion(question._id)}
                      title="Delete Question"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No questions added yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateQuestion}
              >
                Add Your First Question
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Question Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Question Text"
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Options (Select the correct answer)
              </Typography>
              <RadioGroup
                value={formData.options.findIndex(opt => opt.isCorrect).toString()}
                onChange={(e) => {
                  const index = parseInt(e.target.value);
                  handleOptionChange(index, 'isCorrect', true);
                }}
              >
                {formData.options.map((option, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={1}>
                      <FormControlLabel
                        value={index.toString()}
                        control={<Radio />}
                        label=""
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        label={`Option ${String.fromCharCode(65 + index)}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        margin="dense"
                      />
                    </Grid>
                  </Grid>
                ))}
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Explanation (Optional)"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingQuestion ? 'Update' : 'Add'} Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Questions from Document</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a Word document (.docx) with questions formatted as:
            <br />1. Question text?
            <br />a) Option 1
            <br />b) Option 2*  (mark correct answer with *)
            <br />c) Option 3
            <br />d) Option 4
          </Alert>
          
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'rgba(0,0,0,0.05)' : 'transparent'
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography>
              {isDragActive ? 'Drop the file here' : 'Drag and drop a Word document here, or click to select'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionManagement;