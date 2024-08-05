import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Container,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  InputLabel,
  FormControl,
  TableContainer,
  TablePagination,
  AppBar,
  Toolbar,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText
 
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import logo from '../images/ix_logo.png';
 
const theme = createTheme({
  palette: {
    primary: {
      main: "#91c322",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});
 
const drawerWidth = 180;
 
const ScheduleInterview = () => {
 
  const navigate = useNavigate();
 
  const [applicants, setApplicants] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [applicantDetails, setApplicantDetails] = useState({});
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [interviewRound, setInterviewRound] = useState("");
  const [panelMembers, setPanelMembers] = useState("");
  const [panelEmails, setPanelEmails] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [showScheduledInterviews, setShowScheduledInterviews] = useState(true);
  const { id } = useParams();
 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
 
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appliedjobs/job/${id}`
        );
        setApplicants(response.data);
 
        const jobId = response.data[0].jobId;
        fetchJobTitle(jobId);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, []);
 
  useEffect(() => {
    const fetchScheduledInterviews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/scheduledInterview/applicants"
        );
        setScheduledInterviews(response.data);
      } catch (error) {
        console.error("Error fetching scheduled interviews:", error);
      }
    };
    fetchScheduledInterviews();
  }, [scheduledInterviews]);
 
  const fetchJobTitle = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      setJobTitle(response.data.title);
    } catch (error) {
      console.error("Error fetching job title:", error);
    }
  };
 
  const handleApplicantChange = (event) => {
    const selectedApplicantId = event.target.value;
    const applicant = applicants.find(
      (app) => app.userId._id === selectedApplicantId
    );
    setSelectedApplicant(selectedApplicantId);
    setApplicantDetails(applicant.userId);
 
    setInterviewDateTime("");
    setInterviewRound("");
    setPanelMembers("");
    setPanelEmails("");
    setShowScheduledInterviews(true);
  };
 
  const handleSave = async () => {
    const interviewData = {
      applicantId: selectedApplicant,
      applicantName: applicantDetails.name,
      email: applicantDetails.email,
      interviewDateTime,
      interviewRound,
      panelName: panelMembers.split(","),
      panelMailId: panelEmails.split(",")
    };
 
    try {
      await axios.post(
        `http://localhost:5000/api/scheduledInterview/`,
        interviewData
      );
      alert("Interview scheduled successfully");
      setSelectedApplicant("");
      setInterviewDateTime("");
      setInterviewRound("");
      setPanelMembers("");
      setPanelEmails("");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview");
    }
  };
 
  const handleCancel = () => {
    setSelectedApplicant("");
    setApplicantDetails({});
    setInterviewDateTime("");
    setInterviewRound("");
    setPanelMembers("");
    setPanelEmails("");
    setShowScheduledInterviews(false);
  };
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1300, borderBottom: '0.2px solid gray', boxShadow: 'none' }}>
        <Toolbar style={{ paddingLeft: 0 }}>
          <img src={logo} alt="Logo" style={{ height: 70, marginRight: 16, width: 180}} />
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left' }}>
            {/* HR Login */}
          </Typography>
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
 
  <ListItem button onClick={handleLogout} >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ExitToAppIcon />
      <ListItemText primary="Log Out" sx={{ marginLeft: 1 }} />
    </Box>
  </ListItem>
</List>
<Divider />
          </Box>
        </Drawer>
      
      <Container sx={{ mt: 12, ml:28 }}>
        <Box
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={'bold'} textAlign={'left'}>
            Job Title: {jobTitle}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Schedule Interview
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="applicant-select-label">
              Select Applicant
            </InputLabel>
            <Select
              labelId="applicant-select-label"
              value={selectedApplicant}
              onChange={handleApplicantChange}
              label="Select Applicant"
            >
              {applicants.map((applicant) => (
                <MenuItem
                  key={applicant.userId._id}
                  value={applicant.userId._id}
                >
                  {applicant.userId.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedApplicant && showScheduledInterviews && (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Applicant Name</TableCell>
                    <TableCell>{applicantDetails.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{applicantDetails.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interview Date & Time</TableCell>
                    <TableCell>
                      <TextField
                        type="datetime-local"
                        value={interviewDateTime}
                        onChange={(e) => setInterviewDateTime(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interview Round</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel id="interview-round-label">Interview Round</InputLabel>
                        <Select
                          labelId="interview-round-label"
                          value={interviewRound}
                          onChange={(e) => setInterviewRound(e.target.value)}
                          label="Interview Round"
                        >
                          <MenuItem value="HR Screening">HR Screening</MenuItem>
                          <MenuItem value="L1">L1</MenuItem>
                          <MenuItem value="L2">L2</MenuItem>
                          <MenuItem value="L3">L3</MenuItem>
                          <MenuItem value="HR Discussion">HR Discussion</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Panel Members</TableCell>
                    <TableCell>
                      <TextField
                        value={panelMembers}
                        onChange={(e) => setPanelMembers(e.target.value)}
                        fullWidth
                        placeholder="Enter panel members separated by commas"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Panel Email IDs</TableCell>
                    <TableCell>
                      <TextField
                        value={panelEmails}
                        onChange={(e) => setPanelEmails(e.target.value)}
                        fullWidth
                        placeholder="Enter panel email IDs separated by commas"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ mr: 2 }}
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
 
        <Box
          sx={{
            mt: 4,
            backgroundColor: "white",
            p: 4,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Scheduled Interviews
          </Typography>
          {scheduledInterviews.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell><strong>Applicant Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Interview Date & Time</strong></TableCell>
                    <TableCell><strong>Interview Round</strong></TableCell>
                    <TableCell><strong>Panel Members</strong></TableCell>
                    <TableCell><strong>Panel Email IDs</strong></TableCell>
                  </TableRow>
                  {scheduledInterviews
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((interview) => (
                      <TableRow key={interview._id}>
                        <TableCell>{interview.applicantName}</TableCell>
                        <TableCell>{interview.email}</TableCell>
                        <TableCell>{new Date(interview.interviewDateTime).toLocaleString()}</TableCell>
                        <TableCell>{interview.interviewRound}</TableCell>
                        <TableCell>
                          {interview.panelName
                            ? interview.panelName.join(", ")
                            : "No panel members"}
                        </TableCell>
                        <TableCell>
                          {interview.panelMailId
                            ? interview.panelMailId.join(", ")
                            : "No panel email IDs"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={scheduledInterviews.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <Typography variant="body1">No scheduled interviews</Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
 
export default ScheduleInterview;