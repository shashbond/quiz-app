import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import QuizList from './components/Quiz/QuizList';
import QuizTake from './components/Quiz/QuizTake';
import QuizManagement from './components/Admin/QuizManagement';
import QuestionManagement from './components/Admin/QuestionManagement';
import Leaderboard from './components/Leaderboard/Leaderboard';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {user && <Navbar />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/quizzes" 
            element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/quiz/:id/take" 
            element={
              <ProtectedRoute>
                <QuizTake />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/quiz/:id/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/quizzes" 
            element={
              <ProtectedRoute adminOnly>
                <QuizManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/quiz/:id/questions" 
            element={
              <ProtectedRoute adminOnly>
                <QuestionManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;