import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CssBaseline
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

const ScheduleInterview = () => {
  const [applicants, setApplicants] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [applicantDetails, setApplicantDetails] = useState({});
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [panelMembers, setPanelMembers] = useState("");
  const [jobTitle, setJobTitle] = useState(""); 
  const [showScheduledInterviews, setShowScheduledInterviews] = useState(true);
  const { id }= useParams();
  
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
  }, [id]);

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

  // Function to fetch job title by job ID
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
    setPanelMembers("");
    setShowScheduledInterviews(true); 
  };

  const handleSave = async () => {
    const interviewData = {
      applicantId: selectedApplicant,
      applicantName: applicantDetails.name,
      email: applicantDetails.email,
      interviewDateTime,
      panelMembers: panelMembers.split(","),
    };

    try {
      await axios.post(
        `http://localhost:5000/api/scheduledInterview/`,
        interviewData
      );
      alert("Interview scheduled successfully");
      setSelectedApplicant("");
      setInterviewDateTime("");
      setPanelMembers("");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview");
    }
  };

  const handleCancel = () => {
    setSelectedApplicant("");
    setApplicantDetails({});
    setInterviewDateTime("");
    setPanelMembers("");
    setShowScheduledInterviews(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar style={{ paddingLeft: 0 }}>
          <img src={logo} alt="Logo" style={{ height: 63, marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1,display:'flex',justifyContent:'left' }}>
            {/* HR Login */}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
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
                    <TableCell>Interview Rounds</TableCell>
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
                    <TableCell>Panel Name</TableCell>
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
                    <TableCell>Panel email id</TableCell>
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

        {/* Display Scheduled Interviews */}
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
                    <TableCell><strong>Interview round</strong></TableCell>
                    <TableCell><strong>Panel Members</strong></TableCell>
                  </TableRow>
                  {scheduledInterviews
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((interview) => (
                      <TableRow key={interview._id}>
                        <TableCell>{interview.applicantName}</TableCell>
                        <TableCell>{interview.email}</TableCell>
                        <TableCell>{interview.interviewDateTime}</TableCell>
                        <TableCell>{interview.email}</TableCell>
                        <TableCell>
                          {interview.panelMembers
                            ? interview.panelMembers.join(", ")
                            : "No panel members"}
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
