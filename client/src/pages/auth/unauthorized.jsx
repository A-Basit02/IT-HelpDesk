import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  // Decide redirect path
  const redirectPath =
    user && user.role === "admin" ? "/admin/profile" : "/";

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={2}
    >
      <Typography variant="h3" gutterBottom color="error">
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" mb={4}>
        Sorry, you don’t have permission to access this page.
      </Typography>
     

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(redirectPath)}
      >
        Go to Home
      </Button>

     <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => navigate("/login")}
      >
        Go to Login
      </Button>
      </Box>
  );
};

export default Unauthorized;
