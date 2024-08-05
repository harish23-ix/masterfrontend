import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Grid, createTheme, ThemeProvider, styled, AppBar, Toolbar, CssBaseline } from '@mui/material';
import logo from '../ix_logo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#91c322',
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f2f5',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f9f9f9',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/hr/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/list'); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar style={{ paddingLeft: 0 }}>
          
          <img src={logo} alt="Logo" style={{ height: 63, marginRight: 10 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left' }}>
            HR Login
          </Typography>
        </Toolbar>
      </AppBar>
      <StyledContainer maxWidth={false}>
        <StyledBox>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  color="primary"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  color="primary"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton type="submit" variant="contained" color="primary">
                  Login
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        </StyledBox>
      </StyledContainer>
    </ThemeProvider>
  );
};
export default Login;
