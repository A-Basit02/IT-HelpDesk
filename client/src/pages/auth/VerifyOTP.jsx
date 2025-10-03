import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpThunk } from "../../redux/userSlice";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const employeeID = location.state?.employeeID;
  const { loading, error } = useSelector((state) => state.auth);

  // agar direct route access ho jaye bina employeeID ke
  if (!employeeID) {
    navigate("/forgotPassword");
  }

  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const handleVerify = async () => {
    try {
      await dispatch(verifyOtpThunk({ employeeID, otp })).unwrap();
      setToast({ open: true, message: "OTP verified successfully.", severity: "success" });
      setTimeout(() => navigate("/resetPassword", { state: { employeeID } }), 600);
    } catch (err) {
      const msg = err?.message || "Invalid OTP";
      setToast({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Verify OTP
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Enter the OTP sent to your registered email.
        </Typography>

        <Box mt={3}>
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
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
