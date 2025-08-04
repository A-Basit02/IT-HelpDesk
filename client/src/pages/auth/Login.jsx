import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { Container, Box, TextField, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading, error } = useSelector((state) => state.auth);
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      console.log("User authenticated, navigating to:", user.role);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === "admin") {
        navigate("/admin/profile", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    console.log("Error useEffect triggered - error:", error, "loading:", loading);
    if (error && !loading) {
      console.log("Login error from Redux:", error);
      toast.error(error);
    }
  }, [error, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Starting login process...");
    try {
      const result = await dispatch(login({ employeeID, password })).unwrap();
      console.log("Login successful:", result);
    } catch (error) {
      console.error("Login error in handleSubmit:", error);
    } finally {
      setLoading(false);
      console.log("Login process finished");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ffffff", px: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, p: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: "#ab00fa", fontWeight: "bold" }}>
          Login
        </Typography>
        <TextField
          label="Employee ID"
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <span>New user? </span>
          <Button component={Link} to="/signup" size="small" color="primary">
            Sign up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
