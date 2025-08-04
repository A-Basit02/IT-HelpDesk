import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { toast } from "react-toastify";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useCallback } from "react";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  // Fetch tickets with pagination and search
  const fetchTickets = useCallback(
    async (
      currentPage = page,
      currentLimit = limit,
      currentSearch = searchTerm
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: currentLimit,
        });

        if (currentSearch.trim()) {
          params.append("search", currentSearch);
        }

        const response = await axiosInstance.get(
          `/tickets/all?${params.toString()}`
        );
        setTickets(response.data.tickets);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, searchTerm]
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    fetchTickets(value, limit, searchTerm);
  };

  // Handle limit change
  const handleLimitChange = (event) => {
    const newLimit = event.target.value;
    setLimit(newLimit);
    setPage(1);
    fetchTickets(1, newLimit, searchTerm);
  };

  // Handle search with debouncing
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTickets(1, limit, searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, limit]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "primary";
      case "in progress":
        return "warning";
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Function to manually check stale tickets
  const handleCheckStaleTickets = async () => {
    try {
      const response = await axiosInstance.post("/tickets/check-stale-tickets");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to check stale tickets"
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Admin Dashboard
      </Typography>

      {/* Search Bar and Actions */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by ticket number, status, description, employee ID, or name..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600, flex: 1 }}
        />

        <Button
          variant="contained"
          color="warning"
          startIcon={<NotificationsIcon />}
          onClick={handleCheckStaleTickets}
          sx={{ minWidth: 200 }}
        >
          Check Stale Tickets
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : tickets.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No tickets found.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {tickets.map((ticket) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={ticket.ticketNumber}
                justifyContent="center"
                alignItems="center"
              >
                <Card
                  sx={{
                    height: "100%",
                    width: "450px",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      overflow: "hidden",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "2rem",
                      }}
                    >
                      Ticket #{ticket.ticketNumber}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={ticket.status || "N/A"}
                        color={getStatusColor(ticket.status)}
                        size="medium"
                        sx={{ mb: 1, fontSize: "1rem" }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "medium",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "1.5rem",
                          }}
                        >
                          {ticket.name || "N/A"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "1.5rem",
                          }}
                        >
                          EmployeeID: {ticket.employeeID || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.4,
                        minHeight: "4.2em",
                        wordBreak: "break-word",
                        fontSize: "1rem",
                      }}
                    >
                      <strong>Description:</strong>{" "}
                      {ticket.problemStatement || "N/A"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>Created:</strong> {formatDate(ticket.createdAt)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/admin/tickets/${ticket.ticketNumber}`}
                      fullWidth
                      size="large"
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalTickets
                  )}{" "}
                  of {pagination.totalTickets} tickets
                </Typography>

                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Stack>

              {/* Items per page selector */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2">Items per page:</Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={limit}
                    onChange={handleLimitChange}
                    displayEmpty
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
