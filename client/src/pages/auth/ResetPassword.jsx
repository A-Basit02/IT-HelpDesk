import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../utils/userApi";


export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();
  const location = useLocation();
  const employeeID = location.state?.employeeID; // VerifyOTP se aaya
   // VerifyOTP se bhejna hoga
  const handleReset = async () => {
    setError(null);
    setLoading(true);
    try {
      await resetPassword({ employeeID,  newPassword});
      setToast({ open: true, message: "Password reset successfully.", severity: "success" });
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      const msg = err?.message || "Failed to reset password";
      setError(msg);
      setToast({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Enter your new password below.
        </Typography>

        <Box mt={3}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleReset}
            disabled={loading || !newPassword}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
