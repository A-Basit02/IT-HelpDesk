import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

export default function TicketPieChart() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/analytics/all-tickets");
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
      <Box className="flex justify-center items-center" sx={{ minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Count tickets by status
  const openCount = tickets.filter((t) => t.status?.toLowerCase() === "open").length;
  const inProgressCount = tickets.filter((t) => t.status?.toLowerCase() === "in progress").length;
  const closedCount = tickets.filter((t) => t.status?.toLowerCase() === "closed").length;

  const data = [
    { name: "Open", value: openCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Closed", value: closedCount },
  ];

  const COLORS = ["#1976d2", "#f57c00", "#2e7d32"];

  return (
    <Box className="flex flex-col items-center justify-center" sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Ticket Status Analytics
      </Typography>

      {/* Chart container with hover effect */}
      <Box
        className="flex flex-col items-center"
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 4,
          },
          borderRadius: "12px",
          p: 2,
        }}
      >
        {/* Pie Chart */}
        <PieChart width={600} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
            outerRadius={150}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Custom legend with Chips */}
        <Box className="flex justify-center flex-wrap gap-3 mt-4">
          {data.map((entry, index) => (
            <Chip
              key={`chip-${index}`}
              label={entry.name}
              sx={{
                backgroundColor: COLORS[index % COLORS.length],
                color: "white",
                fontSize: "1.5rem",
                px: 2,
                py: 1,
                m: 2,
                borderRadius: "8px",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
