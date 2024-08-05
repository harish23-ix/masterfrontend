import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
} from "@mui/material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
//import profileImage from "../images/profile.png"; // Your profile image
import logoImage from "../ix_logo.png"; // Your logo image
 
const theme = createTheme({
  palette: {
    primary: {
      main: "#91c322",
    },
  },
});
 
const Header = () => {
  const navigate = useNavigate();
 
  const handleProfileClick = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userDetails = response.data;
 
      const missingFields =
        !userDetails.education ||
        !userDetails.phoneNumber ||
        !userDetails.address ||
        !userDetails.resume ||
        !userDetails.skills.length;
      if (missingFields) {
        navigate("/userProfile");
      } else {
        navigate("/AppliedJobs");
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Box sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Toolbar
            sx={{
              paddingLeft: 0,
              "@media (min-width: 600px)": {
                paddingLeft: 0, // Override default padding at this breakpoint
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                padding: "0 10px",
              }}
            >
              <img src={logoImage} alt="Logo" style={{ width: 110, height: 65 }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, marginLeft: 2 }}
              textAlign={"center"}
            >
              JOB PORTAL
            </Typography>
          </Toolbar>
        </Box>
      </AppBar>
    </ThemeProvider>
  );
};
 
export default Header;