import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const TicketDetails = () => {
  const { ticketNumber } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    problemStatement: "",
    status: "",
    problem_dateOccurred: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/tickets/view/${ticketNumber}`);
        setTicket(response.data);
        setFormData({
          problemStatement: response.data.problemStatement || "",
          status: response.data.status || "",
          problem_dateOccurred: response.data.problem_dateOccurred
            ? new Date(response.data.problem_dateOccurred).toISOString().split("T")[0]
            : "",
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketNumber]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/tickets/delete/${ticket.ticketNumber}`);
      toast.success("Ticket deleted successfully");
      navigate("/user/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete ticket");
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      setCancelDialogOpen(true);
    } else {
      setEditMode(true);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/tickets/edit/${ticket.ticketNumber}`, {
        problemStatement: formData.problemStatement,
        status: formData.status,
        problem_dateOccurred: formData.problem_dateOccurred,
      });
      toast.success("Ticket updated successfully");
      setEditMode(false);
      setTicket((prev) => ({
        ...prev,
        problemStatement: formData.problemStatement,
        status: formData.status,
        problem_dateOccurred: formData.problem_dateOccurred,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h6">Loading ticket details...</Typography>
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h6" color="error">{error}</Typography>
    </Container>
  );
  
  if (!ticket) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h6">No ticket found.</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ mr: 2 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Ticket Details
          </Typography>
        </Box>
        
        <Box component="form" noValidate autoComplete="off">
          <Box mb={3}>
            <TextField
              label="Ticket Number"
              value={ticket.ticketNumber || ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Created By"
              value={ticket.name || ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Employee ID"
              value={ticket.employeeID || ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Creation Date"
              value={ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          
          <Box mb={3}>
            {editMode ? (
              <TextField
                label="Problem Occur Date"
                type="date"
                name="problem_dateOccurred"
                value={formData.problem_dateOccurred}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            ) : (
              <TextField
                label="Problem Occur Date"
                value={ticket.problem_dateOccurred ? new Date(ticket.problem_dateOccurred).toLocaleDateString() : "N/A"}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          </Box>
          
          <Box mb={3}>
            {editMode ? (
              <TextField
                label="Status"
                select
                name="status"
                value={formData.status}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="">Select status</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
            ) : (
              <TextField
                label="Status"
                value={ticket.status || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          </Box>
          
          <Box mb={3}>
            {editMode ? (
              <TextField
                label="Problem Statement"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            ) : (
              <TextField
                label="Problem Statement"
                value={ticket.problemStatement || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            )}
          </Box>
          
          <Box mt={4} display="flex" gap={2}>
            {editMode ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, fontSize: 18 }}
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ py: 1.5, fontSize: 18 }}
                  onClick={handleEditToggle}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, fontSize: 18 }}
                  onClick={handleEditToggle}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ py: 1.5, fontSize: 18 }}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>
        
        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            setDeleteDialogOpen(false);
            handleDelete();
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />
        <ConfirmationDialog
          open={cancelDialogOpen}
          title="Cancel Edit"
          message="Are you sure you want to cancel editing? Unsaved changes will be lost."
          confirmText="Yes, Cancel"
          cancelText="No"
          onConfirm={() => {
            setCancelDialogOpen(false);
            setEditMode(false);
          }}
          onCancel={() => setCancelDialogOpen(false)}
        />
      </Paper>
    </Container>
  );
};

export default TicketDetails;
