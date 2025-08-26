// src/pages/admin/Analytics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
// import axiosInstance from "../../utils/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

export default function Analytics() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
       const response = await axiosInstance.get(
          `/tickets/analytics/all-tickets`
        );
        setTickets(response.data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  // Count tickets by status
  const openCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "open"
  ).length;
  const inProgressCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "in progress"
  ).length;
  const closedCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "closed"
  ).length;

  const data = [
    { name: "Open", value: openCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Closed", value: closedCount },
  ];

  const COLORS = ["#1976d2", "#f57c00", "#2e7d32"];

  return (
    <Box className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h4" gutterBottom>
        Ticket Status Analytics
      </Typography>

      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Box>
  );
}
