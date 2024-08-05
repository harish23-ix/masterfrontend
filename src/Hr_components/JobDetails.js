import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateIcon from '@mui/icons-material/Create';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventIcon from '@mui/icons-material/Event';


import {
  Box,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  CssBaseline,
  Container,
  Paper,
  Button,
  Grid,
  Table,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControlLabel,
  Checkbox,
  Modal,
  IconButton,
  Fade, 
  Backdrop,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,

} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../ix_logo.png'; // Adjust the path according to your file structure

const drawerWidth = 180;

const theme = createTheme({
  palette: {
    primary: {
      main: '#91c322',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openApplicantModal, setOpenApplicantModal] = useState(false);
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
  const [newApplicant, setNewApplicant] = useState({
    name: '',
    email: '',
    password: '', // For demonstration; handle securely in your application
    education: '',
    phoneNumber: '',
    address: '',
    resume: '',
    skills: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/addjobs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setJob(response.data);
      setFormState(response.data);

      const applicantsResponse = await axios.get(
        `http://localhost:5000/api/addjobs/${id}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const applicantDetails = await Promise.all(
        applicantsResponse.data.map(async (applicant) => {
          const applicantResponse = await axios.get(
            `http://localhost:5000/api/addjobs/users/${applicant._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          return applicantResponse.data;
        })
      );

      setApplicants(applicantDetails);
    } catch (err) {
      setError('Failed to fetch job details. Please try again.');
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewApplicant((prevApplicant) => ({
      ...prevApplicant,
      [name]: value,
    }));
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenApplicantModal = () => {
    setOpenApplicantModal(true);
  };

  const handleCloseApplicantModal = () => {
    setOpenApplicantModal(false);
  };

  const handleScheduleInterview = () => {
    navigate(`/scheduleInterview/${id}`);
  };

  const handleAddApplicant = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/AddingApplicants/`,
        { ...newApplicant, jobId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Applicant added successfully:', response.data);

      setNewApplicant({
        name: '',
        email: '',
        password: '', // Clear or handle securely as needed
        education: '',
        phoneNumber: '',
        address: '',
        resume: '',
        skills: [],
      });
      setOpenApplicantModal(false);

      fetchJobDetails(); // Re-fetch job details to update the list of applicants
    } catch (err) {
      console.error('Error adding applicant:', err);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        formState,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setJob(response.data);
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1300, borderBottom: '0.2px solid gray', boxShadow: 'none' }}>
        <Toolbar style={{ paddingLeft: 0 }}>
          <img src={logo} alt="Logo" style={{ height: 70, marginRight: 16 ,width: drawerWidth }} />
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
          <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)' }}>
          <List>
  <ListItem button onClick={handleScheduleInterview}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <EventIcon />
      <ListItemText primary="Interviews" sx={{ marginLeft: 2 }} />
    </Box>
  </ListItem>
  <ListItem button onClick={handleOpenApplicantModal} >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CreateIcon />
      <ListItemText primary="Add applicant" sx={{ marginLeft: 1 }} />
    </Box>
  </ListItem>
</List>
<Divider />
<List>
  <ListItem button onClick={handleLogout} sx={{ marginTop: 69 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ExitToAppIcon />
      <ListItemText primary="Logout" sx={{ marginLeft: 1 }} />
    </Box>
  </ListItem>
</List>

          </Box>
        </Drawer>
      <Container>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2} sx={{marginTop:'90px', marginLeft:'130px', }}>
            <Grid item xs={8}>
              <Paper elevation={4} sx={{ p: 3 }} style={{ textAlign: 'left', width : '1010px' }}>
                <Typography variant="h4" fontWeight="bold">
                  Title: {job.title}
                </Typography>
                <Typography variant="h6">Department: {job.department}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {job.description}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  No. of Vacancies: {job.noOfVacancies}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Posted Date: {job.postedDate}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOpenEditModal}>
                  Edit
                </Button>
              </Paper>
            </Grid>

          </Grid>
          <Box sx={{ mt: 3, marginLeft:'140px' }}>
            <Typography variant="h6">Applicants</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Education</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applicants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((applicant, index) => (
                    <TableRow key={index}>
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.education}</TableCell>
                      <TableCell>{applicant.phoneNumber}</TableCell>
                      <TableCell>{applicant.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Modal
  open={openEditModal}
  onClose={handleCloseEditModal}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{
    timeout: 500,
  }}
>
  <Fade in={openEditModal}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <IconButton
        onClick={handleCloseEditModal}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleEditSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
          size="small"
        />
        <TextField
          label="Department"
          variant="outlined"
          name="department"
          value={formState.department}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <TextField
          label="No. of Vacancies"
          variant="outlined"
          type="number"
          name="noOfVacancies"
          value={formState.noOfVacancies}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <TextField
          label="Location"
          variant="outlined"
          name="Location"
          value={formState.Location}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          size="small"
        />
        <TextField
          label="Job Tag"
          variant="outlined"
          name="jobTag"
          value={formState.jobTag}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          size="small"
        />
        <TextField
          label="Start Date"
          variant="outlined"
          type="date"
          name="postedDate"
          value={formState.postedDate}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          size="small"
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
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formState.isActive}
              onChange={handleInputChange}
              name="isActive"
            />
          }
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Edit
          </Button>
          {/* <Button variant="contained" color="primary" fullWidth onClick={handleOpenApplicantModal}>
            Add Applicant
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleScheduleInterview}>
            Schedule Interview
          </Button> */}
        </Box>
      </form>
    </Box>
  </Fade>
</Modal>

        <Dialog open={openApplicantModal} onClose={handleCloseApplicantModal}>
          <DialogTitle>Add Applicant</DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              value={newApplicant.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={newApplicant.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={newApplicant.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="education"
              label="Education"
              value={newApplicant.education}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              value={newApplicant.phoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="address"
              label="Address"
              value={newApplicant.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="resume"
              label="Resume Link"
              value={newApplicant.resume}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="skills"
              label="Skills"
              value={newApplicant.skills.join(', ')}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, skills: e.target.value.split(', ') })
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseApplicantModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddApplicant} color="primary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default JobDetails;
