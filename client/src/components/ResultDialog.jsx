import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ResultDialog = ({ open, onClose, result }) => {
  if (!result) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Import Result</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1"  sx={{ whiteSpace: "pre-line" }} gutterBottom>
          {result.message}
        </Typography>

        {result.errors && result.errors.length > 0 && (
          <>
            <Typography variant="subtitle1" color="error">
              Errors:
            </Typography>
            <List dense>
              {result.errors.map((err, index) => (
                <ListItem key={index}>
                  <ListItemText primary={err} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultDialog;
