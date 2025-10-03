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
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../utils/userApi";

export default function ForgotPassword() {
  const [employeeID, setEmployeeID] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(employeeID);
      setToast({ open: true, message: "OTP sent to your registered email.", severity: "success" });
      // Navigate after a brief delay so user can read the toast
      setTimeout(() => navigate("/verifyOTP", { state: { employeeID } }), 600);
    } catch (err) {
      const msg = err?.message || "Failed to send OTP";
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
          Forgot Password
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Enter your Employee ID. We’ll send an OTP to your registered email.
        </Typography>

        <Box mt={3}>
          <TextField
            fullWidth
            label="Employee ID"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading || !employeeID}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
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
