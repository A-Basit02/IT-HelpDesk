import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    employeeID: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    department: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, employeeID, email, password, confirmPassword, branch, department, role } = formData;

    if (!name || !employeeID || !email || !password || !confirmPassword || !branch || !department || !role) {
      return toast.error("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      await dispatch(
        registerUser({ name, employeeID, email, password, department, branch, role })
      ).unwrap();
      
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error || "Signup failed. Try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ffffff", px: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, p: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: "#ab00fa", fontWeight: "bold" }}>
          Signup
        </Typography>

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          autoFocus
        />

        <TextField
          label="Employee ID"
          name="employeeID"
          value={formData.employeeID}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select role</em>
            </MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Creating..." : "Signup"}
        </Button>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <span>Already a user? </span>
          <Button component={Link} to="/login" size="small" color="primary">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
