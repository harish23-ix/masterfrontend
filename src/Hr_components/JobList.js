import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import logo from "../ix_logo.png";
import CreateIcon from "@mui/icons-material/Create";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";

const drawerWidth = 180;

const theme = createTheme({
  palette: {
    primary: { main: "#91c322" },
    secondary: { main: "#ffffff" },
  },
});

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    department: "",
    description: "",
    noOfVacancies: "",
    postedDate: "",
    jobTag: "",
    isActive: true,
    expiryDate: "",
    Location: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, location]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (id) => {
    navigate(`/jobs/${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterDepartment(event.target.value);
  };

  const handleCreateJobOpen = () => {
    setCreateJobOpen(true);
  };

  const handleCreateJobClose = () => {
    setCreateJobOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formState.title || !formState.department || !formState.description) {
        setErrorMessage("All fields are required.");
        return;
      }
      const jobData = {
        ...formState,
        postedDate:
          formState.postedDate || new Date().toISOString().split("T")[0],
        noOfVacancies: parseInt(formState.noOfVacancies, 10),
      };
      const response = await axios.post(
        "http://localhost:5000/api/addjobs/create",
        jobData
      );
      setFormState({
        title: "",
        department: "",
        description: "",
        noOfVacancies: "",
        postedDate: "",
        jobTag: "",
        isActive: true,
        expiryDate: "",
        Location: "",
      });
      setErrorMessage("");
      handleCreateJobClose();
      fetchJobs(); // Refresh job list after creating a new job
    } catch (error) {
      console.error(
        "Error adding job:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Failed to add job. Please try again.");
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };


  const filteredJobs = jobs.filter((job) => {
    return (
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobTag.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDepartment === "" || job.department === filterDepartment)
    );
  });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" style={{ borderBottom: '0.2px solid gray', boxShadow: 'none',zIndex:1300,backgroundColor:theme.palette.primary.main }}>
        <Toolbar style={{ marginLeft: 0, paddingLeft: 0 }}>
          <Box sx={{ width: drawerWidth, display: 'flex', justifyContent: 'center' ,backgroundColor:'white',height:65}}>
            <img src={logo} alt="Logo"/>
          </Box>
        </Toolbar>
      </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box
            sx={{
              overflow: "auto",
              height: "calc(100vh - 64px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <List>

            <ListItem button onClick={handleBackToDashboard}>
              {/* <Box sx={{ display: "flex", alignItems: "center" , marginTop:3}}> */}
                <DashboardIcon />
                <ListItemText primary="Dashboard" sx={{ marginLeft: 2 , marginTop:0}} />
              {/* </Box> */}
            </ListItem>
              <ListItem
                button
                onClick={handleCreateJobOpen}
              >
                <CreateIcon />
                <ListItemText primary="Create Job" sx={{ marginLeft: 2 }} />
              </ListItem>
              <Divider />
            </List>
           
            <List>
              <ListItem button onClick={handleLogout} >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ExitToAppIcon />
                <ListItemText primary="Log Out" sx={{ marginLeft: 2 }} />
                </Box>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: "64px" }}
        >
          <Container sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Search for jobs..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: "60%", mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ height: "55px" }}
              >
                Search
              </Button>
              <Select
                value={filterDepartment}
                onChange={handleFilterChange}
                displayEmpty
                sx={{ width: "20%", ml: 2 }}
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
              </Select>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <TableContainer component={Paper} sx={{ width: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <TableCell>
                        <Typography
                          variant="h7"
                          fontWeight="bold"
                          color="secondary"
                        >
                          Title
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="h7"
                          fontWeight="bold"
                          color="secondary"
                        >
                          Department
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="h7"
                          fontWeight="bold"
                          color="secondary"
                        >
                          Job Tag
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredJobs
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((job) => (
                        <TableRow
                          key={job._id}
                          onClick={() => handleRowClick(job._id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.department}</TableCell>
                          <TableCell>{job.jobTag}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredJobs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Box>
          </Container>
        </Box>
      </Box>
      <Dialog open={createJobOpen} onClose={handleCreateJobClose}>
        <DialogTitle>Create Job</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              value={formState.title}
              onChange={(e) =>
                setFormState({ ...formState, title: e.target.value })
              }
              fullWidth
              required
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              name="department"
              label="Department"
              variant="outlined"
              value={formState.department}
              onChange={(e) =>
                setFormState({ ...formState, department: e.target.value })
              }
              fullWidth
              required
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              name="description"
              label="Description"
              variant="outlined"
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
              fullWidth
              multiline
              required
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              name="noOfVacancies"
              label="Number of Vacancies"
              variant="outlined"
              value={formState.noOfVacancies}
              onChange={(e) =>
                setFormState({ ...formState, noOfVacancies: e.target.value })
              }
              fullWidth
              type="number"
              required
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Start Date"
              variant="outlined"
              type="date"
              value={formState.postedDate}
              onChange={(e) =>
                setFormState({ ...formState, postedDate: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expiry Date"
              variant="outlined"
              type="date"
              value={formState.expiryDate}
              onChange={(e) =>
                setFormState({ ...formState, expiryDate: e.target.value })
              }
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="jobTag"
              label="Job Tag"
              variant="outlined"
              value={formState.jobTag}
              onChange={(e) =>
                setFormState({ ...formState, jobTag: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              name="Location"
              label="Location"
              variant="outlined"
              value={formState.Location}
              onChange={(e) =>
                setFormState({ ...formState, Location: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: "20px" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.isActive}
                  onChange={(e) =>
                    setFormState({ ...formState, isActive: e.target.checked })
                  }
                  name="isActive"
                  color="primary"
                />
              }
              label="Active"
            />
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
            <DialogActions>
              <Button onClick={handleCreateJobClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default JobPortal;
