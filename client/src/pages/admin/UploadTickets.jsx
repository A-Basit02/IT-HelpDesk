import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ResultDialog from "../../components/ResultDialog";

const UploadTickets = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an Excel file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/tickets/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Open dialog with server response
      setResult(response.data);
      setDialogOpen(true);
      setFile(null);

    } catch (err) {
      setResult({
        message: "Upload failed",
        errors: [err.response?.data?.message || "Server error"],
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Upload Tickets (Excel)
      </Typography>

      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          mb: 3,
        }}
      >
        <input
          accept=".xlsx, .xls"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Choose Excel File
          </Button>
        </label>

        {file && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Selected: <strong>{file.name}</strong>
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !file}
        onClick={handleUpload}
        startIcon={
          loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
        }
      >
        {loading ? "Uploading..." : "Upload & Import Tickets"}
      </Button>

      {/* ✅ Show Result Dialog */}
      <ResultDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        result={result}
      />
    </Container>
  );
};

export default UploadTickets;
