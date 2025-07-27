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
  Chip,
  IconButton
} from '@mui/material';
import { 
  Quiz, 
  People, 
  Assessment, 
  Add,
  Edit,
  Visibility,
  BarChart
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalParticipants: 0,
    totalAttempts: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const quizzesResponse = await axios.get('/api/quiz?limit=10');
      const quizzes = quizzesResponse.data.quizzes;
      
      setRecentQuizzes(quizzes);
      
      const activeQuizzes = quizzes.filter(quiz => quiz.isActive).length;
      
      setStats({
        totalQuizzes: quizzesResponse.data.total || 0,
        activeQuizzes,
        totalParticipants: 0,
        totalAttempts: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getQuizStatus = (quiz) => {
    if (!quiz.isActive) return { label: 'Inactive', color: 'default' };
    
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    
    if (now < startDate) return { label: 'Scheduled', color: 'info' };
    if (now > endDate) return { label: 'Ended', color: 'secondary' };
    return { label: 'Active', color: 'success' };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/quizzes')}
        >
          Create Quiz
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Quiz color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Quizzes</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {stats.totalQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Quizzes</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {stats.activeQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Participants</Typography>
              </Box>
              <Typography variant="h3" color="secondary">
                {stats.totalParticipants}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BarChart color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Attempts</Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {stats.totalAttempts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Recent Quizzes
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/quizzes')}
            >
              Manage All Quizzes
            </Button>
          </Box>
          
          {recentQuizzes.length > 0 ? (
            <List>
              {recentQuizzes.slice(0, 5).map((quiz) => {
                const status = getQuizStatus(quiz);
                return (
                  <ListItem key={quiz._id} divider>
                    <ListItemText
                      primary={quiz.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Created: {formatDate(quiz.createdAt)} | 
                            Duration: {quiz.duration} min | 
                            Questions: {quiz.totalQuestions}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/quiz/${quiz._id}/questions`)}
                        title="Edit Questions"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/quiz/${quiz._id}/leaderboard`)}
                        title="View Leaderboard"
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary" gutterBottom>
                No quizzes created yet.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin/quizzes')}
              >
                Create Your First Quiz
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;