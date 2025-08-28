import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, CircularProgress } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

export default function TicketPieChart({ onSliceClick }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get(
          "/tickets/analytics/all-tickets"
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
      <Box className="flex justify-center items-center" sx={{ minHeight: 200 }}>
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
    { id: 0, value: openCount, label: "open", color: "#AB00FA" },
    { id: 1, value: inProgressCount, label: "in progress",  color: "#ED6C02" },
    { id: 2, value: closedCount, label: "closed", color: "#2E7D32"},
  ];

  return (
    <Box className="flex flex-col items-center justify-center" sx={{ mb: 4 }}>
    
      <PieChart
        series={[
          {
            data,
            highlightScope: { fade: "global", highlight: "item" },
            
          },
        ]}
        height={300}
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 4,
          },
        }}
        
        onItemClick={(_, item) => {
          const clickedData = data[item.dataIndex]; // 👈 data array se label/value nikal lo
          if (onSliceClick && clickedData?.label) {
            onSliceClick(clickedData.label);
          }
        }}
      />
    </Box>
  );
}
