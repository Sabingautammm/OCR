import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthDashboard = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Box textAlign="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isLogin ? 'Please sign in to continue' : 'Sign up to get started'}
          </Typography>
        </Box>

        {/* Toggle Button */}
        <Box textAlign="center" mb={3}>
          <Button onClick={toggleForm} sx={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#1976d2' }}>
            {isLogin ? 'Don’t have an account? Sign Up' : 'Already have an account? Log In'}
          </Button>
        </Box>

        {/* Form Display */}
        {isLogin ? <LoginForm /> : <SignUpForm setIsLogin={setIsLogin} />}
      </Paper>
    </Grid>
  );
};

export default AuthDashboard;
