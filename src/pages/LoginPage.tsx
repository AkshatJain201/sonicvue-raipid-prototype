import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Avatar,
  Paper
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import backgroundImage from '../images/iStock-887564368.png';
import c5ilogo from '../images/c5i_logo.png';
import sonicvue from '../images/sonic_vue_logo.png';
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Dummy credentials
    if (username === 'astha@c5i.ai' && password === 'Password@123') {
      login();
      navigate('/upload');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container
        sx={{
          backgroundColor: 'rgba(255, 255, 255)',
          padding: 3,
          borderRadius: 2,
          marginRight: '80px',
          width: '400px'
        }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src={c5ilogo} alt="C5i Logo" style={{ height: '30px', marginRight: '10px', marginBottom: '10px' }} />
            <Typography variant="h6" component="span" sx={{ marginBottom: '10px', mx: 1 }}>|</Typography>
            <img src={sonicvue} alt="Sonicvue Logo" style={{ height: '20px', marginLeft: '10px', marginBottom: '5px' }} />
          </Typography>
          <Typography >
            Sign in
          </Typography>
          <Paper elevation={3} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', mt: 3, p: 3, width: '100%' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email Address"
                name="username"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Background color
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6800E0', // Label color
                  },
                  '& .MuiInputBase-input': {
                    color: '#000', // Input text color
                  },
                  '& .MuiInputBase-root.Mui-focused': {
                    borderColor: '#6800E0', // Border color on focus
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Background color
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6800E0', // Label color
                  },
                  '& .MuiInputBase-input': {
                    color: '#000', // Input text color
                  },
                  '& .MuiInputBase-root.Mui-focused': {
                    borderColor: '#6800E0', // Border color on focus
                  },
                }}
              />
              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#6800E0',
                  color: 'white', 
                  '&:hover': {
                    backgroundColor: '#5500b1', 
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
