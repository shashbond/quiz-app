import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
  Paper
} from '@mui/material';
import { EmojiEvents, Timer, Person } from '@mui/icons-material';
import axios from 'axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const Leaderboard = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    fetchQuizDetails();
  }, [id]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}/leaderboard`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return '#CD7F32';
      default: return 'default';
    }
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <EmojiEvents style={{ color: getRankColor(rank) }} />;
    }
    return rank;
  };

  if (loading) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Leaderboard
          </Typography>
          {quiz && (
            <Typography variant="h6" color="textSecondary">
              {quiz.title}
            </Typography>
          )}
        </CardContent>
      </Card>

      {leaderboard.length > 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performers
            </Typography>
            
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Participant</TableCell>
                    <TableCell align="center">Score</TableCell>
                    <TableCell align="center">Percentage</TableCell>
                    <TableCell align="center">Duration</TableCell>
                    <TableCell align="center">Completed At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((entry) => (
                    <TableRow
                      key={entry.participant._id}
                      sx={{
                        backgroundColor: entry.rank <= 3 ? 'rgba(255, 215, 0, 0.1)' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getRankIcon(entry.rank)}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>
                            {entry.participant.firstName[0]}{entry.participant.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">
                              {entry.participant.firstName} {entry.participant.lastName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              @{entry.participant.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Chip
                          label={`${entry.totalMarks} marks`}
                          color={entry.rank <= 3 ? 'primary' : 'default'}
                          variant={entry.rank <= 3 ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body1">
                          {entry.percentage.toFixed(1)}%
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          <Timer fontSize="small" />
                          <Typography variant="body2">
                            {formatDuration(entry.duration)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(entry.completedAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Results Yet
              </Typography>
              <Typography color="textSecondary">
                Be the first to complete this quiz and appear on the leaderboard!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Leaderboard;