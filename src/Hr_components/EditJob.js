import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress, Card, CardContent, CardActions } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar } from '@mui/material';
import logo from '../ix_logo.png'; // Adjust the path according to your file structure

const theme = createTheme({
  palette: {
    primary: {
      main: '#91c322',
    },
  },
});

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({
    title: '',
    department: '',
    description: '',
    noOfVacancies: '',
    postedDate: '',
    jobTag: '',
    isActive: true,
    expiryDate: '',
    Location: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJob(response.data);
        setFormState(response.data);
      } catch (err) {
        setError('Failed to fetch job details. Please try again.');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, formState, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/list'); // Navigate back to the job list after a successful update
    } catch (error) {
      console.error('Error updating job:', error.response ? error.response.data : error.message);
      setError('Failed to update job. Please try again.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar style = {{paddingLeft : 0}}>
          <img src={logo} alt="Logo" style={{ height: 63, marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Edit Job
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
        <Card sx={{ width: '50%', minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Edit Job Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                required
              />
              <TextField
                label="Department"
                fullWidth
                margin="normal"
                value={formState.department}
                onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                required
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                required
              />
              <TextField
                label="No. of Vacancies"
                type="number"
                fullWidth
                margin="normal"
                value={formState.noOfVacancies}
                onChange={(e) => setFormState({ ...formState, noOfVacancies: e.target.value })}
                required
              />
              <TextField
                label="Posted Date"
                type="date"
                fullWidth
                margin="normal"
                value={formState.postedDate}
                onChange={(e) => setFormState({ ...formState, postedDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Job Tags (comma-separated)"
                fullWidth
                margin="normal"
                value={formState.jobTag}
                onChange={(e) => setFormState({ ...formState, jobTag: e.target.value })}
              />
              <TextField
                label="Expiry Date"
                type="date"
                fullWidth
                margin="normal"
                value={formState.expiryDate}
                onChange={(e) => setFormState({ ...formState, expiryDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Location"
                fullWidth
                margin="normal"
                value={formState.Location}
                onChange={(e) => setFormState({ ...formState, Location: e.target.value })}
              />
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default EditJob;
