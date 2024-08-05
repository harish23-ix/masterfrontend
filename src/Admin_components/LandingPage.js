import React, { useState } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Grid, Typography, Box, CssBaseline, TextField } from '@mui/material';
import { styled } from '@mui/system';
import bg from './images/10608.jpg';
import logoImage from './images/ix.svg';
import {useNavigate} from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: 'sans-serif',
  },
  palette: {
    primary: {
      main: '#91c322',
    },
    secondary: {
      main: '#000000',
    },
  },
});

const Root = styled('div')({
  height: '100vh',
  width: '100vw',
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
});

const LeftSection = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
  padding: theme.spacing(4),
}));

const LogoImage = styled('img')({
  width: '40vh',
  marginBottom: '16px',
});

const RightSection = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  width: '100%',
  maxWidth: '200px',
  transition: 'background-color 0.3s, color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
}));

const LoginSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showHRLogin, setShowHRLogin] = useState(false);
  const navigate = useNavigate();

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
    setShowHRLogin(false); // Hide HR login section if admin login is clicked
  };

  const handleHRLoginClick = () => {
    setShowHRLogin(true);
    setShowAdminLogin(false); // Hide admin login section if HR login is clicked
  };
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin_auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Replace with your desired navigation method (e.g., react-router-dom history or navigation)
        // For simplicity, navigate to '/list' directly here
        navigate('/dashboard');
        // alert('Logged in successfully!');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error logging in');
    }
  };
  const handleHRLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/hr/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Replace with your desired navigation method (e.g., react-router-dom history or navigation)
        // For simplicity, navigate to '/list' directly here
        navigate('/list');
        // alert('Logged in successfully!');
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
      <Root>
        <Grid container style={{ height: '100vh' }}>
          <LeftSection item xs={12} md={6}>
            <LogoImage src={logoImage} alt="Logo" />
            <Typography variant="h4" component="h2">
              Recruitment Management Portal
            </Typography>
          </LeftSection>
          <RightSection item xs={12} md={6}>
            {!showAdminLogin && !showHRLogin && (
              <div>
                <ButtonStyled variant="contained" color="primary" onClick={handleAdminLoginClick}>
                  Admin Login
                </ButtonStyled>
                <ButtonStyled variant="contained" color="primary" onClick={handleHRLoginClick}>
                  HR Login
                </ButtonStyled>
              </div>
            )}
            {showAdminLogin && (
              <LoginSection>
                <Typography variant="h6" gutterBottom>
                  Admin Login
                </Typography>
                {/* Example form for admin login */}
                <form onSubmit={handleAdminLogin}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <ButtonStyled variant="contained" color="primary" type="submit">
                    Login
                  </ButtonStyled>
                </form>
              </LoginSection>
            )}
            {showHRLogin && (
              <LoginSection>
                <Typography variant="h6" gutterBottom>
                  HR Login
                </Typography>
                {/* Form for HR login */}
                <form onSubmit={handleHRLogin}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <ButtonStyled variant="contained" color="primary" type="submit">
                    Login
                  </ButtonStyled>
                </form>
              </LoginSection>
            )}
          </RightSection>
        </Grid>
      </Root>
    </ThemeProvider>
  );
};

export default LandingPage;
