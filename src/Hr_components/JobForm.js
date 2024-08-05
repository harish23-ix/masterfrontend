import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, Container, Box, TextField, Checkbox, FormControlLabel, Button, Typography, Paper ,AppBar, Toolbar,} from '@mui/material';
import logo from '../ix_logo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#91c322',
    },
  },
});

const JobForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formState, setFormState] = useState({
    title: '',
    department: '',
    description: '',
    noOfVacancies: '',
    postedDate: '',
    jobTag: '',
    isActive: true,
    expiryDate: '',
    Location: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formState.title || !formState.department || !formState.description) {
        setErrorMessage('All fields are required.');
        return;
      }

      const jobData = {
        ...formState,
        postedDate: formState.postedDate || new Date().toISOString().split('T')[0],
        noOfVacancies: parseInt(formState.noOfVacancies, 10)
      };

      const response = await axios.post('http://localhost:5000/api/addjobs/create', jobData);
      
      setFormState({
        title: '',
        department: '',
        description: '',
        noOfVacancies: '',
        postedDate: '',
        jobTag: '',
        isActive: true,
        expiryDate: '',
        Location: ''
      });
      setErrorMessage('');
      navigate('/list');
    } catch (error) {
      console.error('Error adding job:',  error.response ? error.response.data : error.message);
      setErrorMessage('Failed to add job. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/list');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar style={{ paddingLeft: 0 }}>
          <img src={logo} alt="Logo" style={{ height: 63, marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm">
      
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Job
          </Typography>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Department"
              variant="outlined"
              value={formState.department}
              onChange={(e) => setFormState({ ...formState, department: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="No. of Vacancies"
              variant="outlined"
              type="number"
              value={formState.noOfVacancies}
              onChange={(e) => setFormState({ ...formState, noOfVacancies: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Location"
              variant="outlined"
              value={formState.Location}
              onChange={(e) => setFormState({ ...formState, Location: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Job Tags (comma-separated)"
              variant="outlined"
              value={formState.jobTag}
              onChange={(e) => setFormState({ ...formState, jobTag: e.target.value })}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Start Date"
              variant="outlined"
              type="date"
              value={formState.postedDate}
              onChange={(e) => setFormState({ ...formState, postedDate: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expiry Date"
              variant="outlined"
              type="date"
              value={formState.expiryDate}
              onChange={(e) => setFormState({ ...formState, expiryDate: e.target.value })}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.isActive}
                  onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                  name="isActive"
                  color="primary"
                  label="Active"
                />
              }
            />
            <Box display="flex" justifyContent="center" marginTop="20px">
              <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="outlined"  onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default JobForm;
