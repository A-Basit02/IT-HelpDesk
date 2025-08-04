import React from "react";
import { useSelector } from "react-redux";
import { Container, Box, Typography, Paper, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  console.log("AdminProfile component - user:", user, "loading:", loading);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", bgcolor: "#ffffff", px: 2, py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="body1" align="center" gutterBottom sx={{ color: "#ab00fa", fontWeight: "bold" , fontSize: '2rem' }}>
          My Profile
        </Typography>
        <Box sx={{ mt: 2, fontSize: '1.5rem' }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" , fontSize: '1.5rem'}}>
            Name:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 , fontSize: '1.5rem' }}>
            {user.name}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: '1.5rem' }}>
            Employee ID:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: '1.5rem' }}>
            {user.employeeID}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: '1.5rem' }}>
            Email:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: '1.5rem' }}>
            {user.email}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold" , fontSize: '1.5rem'}}>
            Department:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 , fontSize: '1.5rem'}}>
            {user.department}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold" , fontSize: '1.5rem'}}>
            Branch:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 , fontSize: '1.5rem'}}>
            {user.branch}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
