import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Pagination
} from '@mui/material';
import { Search, PlayArrow, Timer, Quiz as QuizIcon } from '@mui/icons-material';
import axios from 'axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [page, searchTerm]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/quiz', {
        params: {
          page,
          limit: 9,
          search: searchTerm
        }
      });
      
      setQuizzes(response.data.quizzes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isQuizAvailable = (quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    
    return quiz.isActive && now >= startDate && now <= endDate;
  };

  const getQuizStatus = (quiz) => {
    if (!quiz.isActive) return { label: 'Inactive', color: 'default' };
    
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    
    if (now < startDate) return { label: 'Upcoming', color: 'info' };
    if (now > endDate) return { label: 'Ended', color: 'secondary' };
    return { label: 'Available', color: 'success' };
  };

  if (loading && page === 1) {
    return <LoadingSpinner message="Loading quizzes..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Quizzes
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {quizzes.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const available = isQuizAvailable(quiz);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={quiz._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" gutterBottom>
                          {quiz.title}
                        </Typography>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="textSecondary" paragraph>
                        {quiz.description || 'No description available'}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Timer fontSize="small" />
                          <Typography variant="body2">
                            {quiz.duration} minutes
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <QuizIcon fontSize="small" />
                          <Typography variant="body2">
                            {quiz.totalQuestions} questions
                          </Typography>
                        </Box>
                      </Box>

                      {quiz.startDate && quiz.endDate && (
                        <Typography variant="body2" color="textSecondary">
                          Available: {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}
                        </Typography>
                      )}
                    </CardContent>

                    <Box p={2} pt={0}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => navigate(`/quiz/${quiz._id}/take`)}
                        disabled={!available}
                      >
                        {available ? 'Start Quiz' : 'Not Available'}
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/quiz/${quiz._id}/leaderboard`)}
                      >
                        View Leaderboard
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No quizzes found
          </Typography>
          <Typography color="textSecondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'No quizzes are currently available'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QuizList;