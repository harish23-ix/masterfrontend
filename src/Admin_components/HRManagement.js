import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import EventIcon from '@mui/icons-material/Event';
import CreateIcon from "@mui/icons-material/Create";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";
import logo from "../images/ix_logo.png";

import {
  Box,
  // Typography,
  // CircularProgress,
  AppBar,
  Toolbar,
  CssBaseline,
  Container,
  Paper,
  Button,
  // Grid,
  Table,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  // FormControlLabel,
  // Checkbox,
  // Modal,
  // IconButton,
  // Fade,
  // Backdrop,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
} from "@mui/material";

// const DeleteButton = styled(IconButton)(({ theme }) => ({
//   color: theme.palette.error.main, // Red color for delete icon
// }));

// const EditButton = styled(IconButton)(({ theme }) => ({
//   color: theme.palette.primary.main, // Blue color for edit icon (primary color)
// }));

const theme = createTheme({
  palette: {
    primary: {
      main: "#91c322",
    },
  },
  typography: {
    h6: {
      fontSize: "1.5rem",
    },
  },
});

const drawerWidth = 180;

const HRManagement = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hrList, setHrList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHRList();
  }, []);

  const fetchHRList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/");
      setHrList(response.data);
    } catch (error) {
      console.error("Error fetching HR list:", error);
    }
  };

  const handleCreateHR = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/create_hr",
        {
          name,
          email,
          password,
        }
      );

      console.log("HR created:", response.data);

      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      fetchHRList();
    } catch (error) {
      console.error("Error creating HR:", error);
    }
  };

  const handleEdit = (id) => {
    const hrToEdit = hrList.find((hr) => hr._id === id);
    if (hrToEdit) {
      setName(hrToEdit.name);
      setEmail(hrToEdit.email);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleUpdateHR = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/update/${editingId}`,
        {
          name,
          email,
        }
      );

      console.log("HR updated:", response.data);

      setName("");
      setEmail("");
      setEditingId(null);
      setShowForm(false);
      fetchHRList();
    } catch (error) {
      console.error("Error updating HR:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/delete/${id}`
      );
      console.log("HR deleted:", response.data);
      fetchHRList();
    } catch (error) {
      console.error("Error deleting HR:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setName("");
    setEmail("");
    setPassword("");
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setName("");
    setEmail("");
    setPassword("");
    setEditingId(null);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" style={{ borderBottom: '0.2px solid gray', boxShadow: 'none',zIndex:1300,backgroundColor:theme.palette.primary.main }}>
        <Toolbar style={{ marginLeft: 0, paddingLeft: 0 }}>
          <Box sx={{ width: drawerWidth, display: 'flex', justifyContent: 'center' ,backgroundColor:'white',height:65}}>
            <img src={logo} alt="Logo" />
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
        <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <List>
            <ListItem button onClick={handleBackToDashboard}>
              {/* <Box sx={{ display: "flex", alignItems: "center" , marginTop:3}}> */}
                <DashboardIcon />
                <ListItemText primary="Dashboard" sx={{ marginLeft: 2 }} />
              {/* </Box> */}
            </ListItem>
            <ListItem button onClick={toggleForm}>
              {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
                <CreateIcon />
                <ListItemText primary="Create" sx={{ marginLeft: 2 }} />
              {/* </Box> */}
            </ListItem>
            <Divider />
          </List>
          
          <List>
            <ListItem button onClick={handleLogout} >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ExitToAppIcon />
                <ListItemText primary="Log Out" sx={{ marginLeft: 1 }} />
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Container
        maxWidth="lg"
        sx={{ position: "relative", marginTop: 20, marginLeft: 28 }}
      >
        <Box className="container">
          <h2 style={{ textAlign: "center" }}>HR Management</h2>
          {!showForm && (
            <Box display="flex" justifyContent="space-between"></Box>
          )}

          {showForm && (
            <form
              onSubmit={editingId ? handleUpdateHR : handleCreateHR}
              style={{ marginTop: "20px" }}
            >
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                style={{ marginBottom: "10px" }}
              />
              {!editingId && (
                <TextField
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  style={{ marginBottom: "10px" }}
                />
              )}
              <Box
                display="flex"
                justifyContent="flex-end"
                gap="10px"
                style={{ marginBottom: 15 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#91c322", color: "white" }}
                >
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#91c322", color: "white" }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hrList.map((hr) => (
                  <TableRow key={hr._id}>
                    <TableCell>{hr.name}</TableCell>
                    <TableCell>{hr.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        style={{ color: "black" }}
                        onClick={() => handleEdit(hr._id)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="contained"
                        style={{ color: "black", marginLeft: "10px" }}
                        onClick={() => handleDelete(hr._id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HRManagement;
