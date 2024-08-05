import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import logo from '../images/ix.svg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Box,
  AppBar,
  Toolbar,
  CssBaseline,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
  Typography,
} from '@mui/material';

const drawerWidth = 180;

const theme = createTheme({
  palette: {
    primary: {
      main: '#91c322',
    },
  },
  typography: {
    h6: {
      fontSize: '1.5rem', // Increase AppBar title font size
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
        },
      },
    },
  },
});

const App = () => {
  const navigate = useNavigate();

  const handleNavClick = (view) => {
    if (view === 'HR') {
      navigate('/hr-management');
    } else if (view === 'Job') {
      navigate('/list');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
       <AppBar position="fixed" style={{ borderBottom: '0.2px solid gray', boxShadow: 'none',zIndex:1300,backgroundColor:theme.palette.primary.main }}>
        <Toolbar style={{ marginLeft: 0, paddingLeft: 0 }}>
          <Box sx={{ width: drawerWidth, display: 'flex', justifyContent: 'center' ,backgroundColor:'white',height:65}}>
            <img src={logo} alt="Logo" style={{ height: 50,marginTop:'4px'}} />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* <List>
            <ListItem button onClick={() => handleNavClick('HR')}>
              <ListItemText primary="HR Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleNavClick('Job')}>
              <ListItemText primary="Job Dashboard" />
            </ListItem>
          </List> */}
          <Divider />
          <List>
            <ListItem button onClick={handleLogout} >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ExitToAppIcon />
                <ListItemText primary="Log Out" sx={{ marginLeft: 1 }} />
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', marginLeft: '500px' }}>
        <Box
          sx={{
            border: '1px solid #ddd',
            padding: 4,
            borderRadius: 2,
            width: '100%',
            minWidth: '700px',
            backgroundColor: '#fff',
            //boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box mt={2}>
              <Button variant="contained" color="primary" size="large" onClick={() => handleNavClick('HR')} sx={{ fontSize: '1.25rem', padding: '12px 24px', width: '250px' }}>
                HR Dashboard
              </Button>
              <Box mt={2}>
                <Button variant="contained" color="primary" size="large" onClick={() => handleNavClick('Job')} sx={{ fontSize: '1.25rem', padding: '12px 24px', width: '250px' }}>
                  Job Dashboard
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
