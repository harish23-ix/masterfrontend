import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import logo from '../ix_logo.png'; // Import your logo file
// import './userProfile.css'; // Update this with your styles

const theme = createTheme({
  palette: {
    primary: {
      main: '#91c322',
    },
  },
});

const AddApplicant = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    education: '',
    phoneNumber: '',
    address: '',
    resume: '',
    skills: []
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
  };

  const handleAddSkill = () => {
    if (skillsInput.trim()) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        skills: [...prevDetails.skills, skillsInput.trim()],
      }));
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      skills: prevDetails.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/hrApplicant/addApplicant',
        { userDetails, jobId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Applicant added successfully');
      navigate(`/jobs/status/${jobId}`);
    } catch (error) {
      console.error('Error adding applicant:', error);
      alert('Failed to add applicant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar style={{marginLeft : 0, PaddingLeft : 0}}>
          <img src={logo} alt="Logo" style={{ height: 63, marginRight: 0 }}  />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Job Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add Applicant
          </Typography>
          <form onSubmit={handleUpdate}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={userDetails.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Education"
              name="education"
              value={userDetails.education}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={userDetails.address}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Resume URL"
              name="resume"
              value={userDetails.resume}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Skills"
              name="skillsInput"
              value={skillsInput}
              onChange={handleSkillsChange}
              helperText="Add a skill and press the Add button"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddSkill}
              sx={{ mt: 2 }}
            >
              Add Skill
            </Button>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {userDetails.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddApplicant;
