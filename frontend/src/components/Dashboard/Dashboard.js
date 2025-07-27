import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import { Quiz, TrendingUp, History, PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    availableQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quizzesResponse, attemptsResponse] = await Promise.all([
        axios.get('/api/quiz?limit=5'),
        axios.get('/api/attempt/user/attempts?limit=5')
      ]);

      setRecentQuizzes(quizzesResponse.data.quizzes);
      setRecentAttempts(attemptsResponse.data.attempts);

      const completedCount = attemptsResponse.data.attempts.filter(
        attempt => attempt.status === 'completed'
      ).length;
      
      const totalScore = attemptsResponse.data.attempts
        .filter(attempt => attempt.status === 'completed')
        .reduce((sum, attempt) => sum + attempt.percentage, 0);
      
      const averageScore = completedCount > 0 ? totalScore / completedCount : 0;

      setStats({
        availableQuizzes: quizzesResponse.data.total || 0,
        completedQuizzes: completedCount,
        averageScore: Math.round(averageScore)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'timed_out': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Quiz color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Available Quizzes</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {stats.availableQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <History color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Completed Quizzes</Typography>
              </Box>
              <Typography variant="h3" color="secondary">
                {stats.completedQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Average Score</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Quizzes
              </Typography>
              {recentQuizzes.length > 0 ? (
                <List>
                  {recentQuizzes.map((quiz) => (
                    <ListItem key={quiz._id} divider>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`Duration: ${quiz.duration} minutes | Questions: ${quiz.totalQuestions}`}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => navigate(`/quiz/${quiz._id}/take`)}
                        >
                          Start
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">
                  No quizzes available at the moment.
                </Typography>
              )}
              <Box mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/quizzes')}
                  fullWidth
                >
                  View All Quizzes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Attempts
              </Typography>
              {recentAttempts.length > 0 ? (
                <List>
                  {recentAttempts.map((attempt) => (
                    <ListItem key={attempt._id} divider>
                      <ListItemText
                        primary={attempt.quiz.title}
                        secondary={`Date: ${formatDate(attempt.createdAt)} | Score: ${attempt.totalMarks || 0} marks`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={attempt.status}
                          color={getStatusColor(attempt.status)}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">
                  No quiz attempts yet. Take your first quiz!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;