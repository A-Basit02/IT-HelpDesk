import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";

// Add new prop: currentUserRole (to check if logged-in user is super_admin)
const UserForm = ({
  open,
  onClose,
  onSubmit,
  user = null,
  loading = false,
  error = null,
}) => {
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserRole = currentUser?.role || "user"; // fallback to "user"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeID: "",
    department: "",
    branch: "",
    role: "user",
    password: "",
    approval_status: "", // NEW FIELD
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        employeeID: user.employeeID || "",
        department: user.department || "",
        branch: user.branch || "",
        role: user.role || "user",
        password: "",
        approval_status: user.approval_status || user.approvalStatus || "", // ✅ Load approval status
      });
    } else {
      setFormData({
        name: "",
        email: "",
        employeeID: "",
        department: "",
        branch: "",
        role: "user",
        password: "",
        approval_status: "",
      });
    }
    setErrors({});
  }, [user]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.employeeID.trim()) {
      newErrors.employeeID = "Employee ID is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    if (!user || formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!/[A-Za-z]/.test(formData.password)) {
        newErrors.password = "Password must contain an alphabet";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/[!@#$%^&*_.]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one special character";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = { ...formData };

      if (!submitData.password) {
        delete submitData.password;
      }
      console.log(currentUserRole);
      // If user is not super_admin → don’t allow sending approvalStatus
      if (currentUserRole !== "super_admin") {
        delete submitData.approval_status;
      }

      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      employeeID: "",
      department: "",
      branch: "",
      role: "user",
      password: "",
      approval_status: "",
    });
    setErrors({});
    onClose();
  };

  const isEditMode = !!user;
  const title = isEditMode ? "Edit User" : "Add New User";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, boxShadow: 4 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 1 }}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={loading}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                required
                disabled={loading}
              />
            </Grid>

            {/* Employee ID */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeID}
                onChange={handleChange("employeeID")}
                error={!!errors.employeeID}
                helperText={errors.employeeID}
                required
                disabled={loading}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleChange("role")}
                  label="Role"
                  disabled={loading}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={handleChange("department")}
                error={!!errors.department}
                helperText={errors.department}
                required
                disabled={loading}
              />
            </Grid>

            {/* Branch */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                value={formData.branch}
                onChange={handleChange("branch")}
                error={!!errors.branch}
                helperText={errors.branch}
                required
                disabled={loading}
              />
            </Grid>

            {/* Approval Status - Only Super Admin */}

            {currentUserRole === "super_admin" && (
              <Grid item xs={12} sm={6} minWidth={"278px"}>
                <FormControl fullWidth>
                  <InputLabel>Approval Status</InputLabel>
                  <Select
                    value={formData.approval_status}
                    onChange={handleChange("approval_status")}
                    label="Approval Status"
                    disabled={loading}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={
                  isEditMode
                    ? "New Password (leave blank to keep current)"
                    : "Password"
                }
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={
                  errors.password ||
                  (isEditMode
                    ? "Leave blank to keep current password"
                    : "Minimum 6 characters")
                }
                required={!isEditMode}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ minWidth: 100 }}
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
