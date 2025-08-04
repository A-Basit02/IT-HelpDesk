import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const CreateTicket = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [problemDateOccurred, setProblemDateOccurred] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const hasUnsavedChanges = problemDateOccurred || problemStatement;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!problemDateOccurred) {
      toast.error("Please select the problem occur date");
      return;
    }
    if (!problemStatement.trim()) {
      toast.error("Please enter the problem statement");
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const response = await axiosInstance.post("/tickets/create", {
        status: "Open",
        problem_dateOccurred: problemDateOccurred,
        problemStatement,
      });
      toast.success("Ticket created successfully");
      const ticketNumber = response.data.ticketNumber;
      navigate(`/user/tickets/${ticketNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Warn on navigation if unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigateAway = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      navigate(-1);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={handleNavigateAway} 
            sx={{ mr: 2 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Create Ticket
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Box mb={3}>
            <TextField
              label="Creator Name"
              value={user?.name || ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Employee ID"
              value={user?.employeeID || ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Creation Date"
              type="date"
              value={currentDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Problem Occur Date"
              type="date"
              value={problemDateOccurred}
              onChange={(e) => setProblemDateOccurred(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Problem Statement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
          </Box>
          <Box mt={4} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: 18 }}
              disabled={loading || isSubmitting}
            >
              {loading ? "Creating..." : isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ py: 1.5, fontSize: 18 }}
              onClick={handleNavigateAway}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
      <ConfirmationDialog
        open={showUnsavedDialog}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={() => {
          setShowUnsavedDialog(false);
          navigate(-1);
        }}
        onCancel={() => setShowUnsavedDialog(false)}
      />
    </Container>
  );
};

export default CreateTicket;
