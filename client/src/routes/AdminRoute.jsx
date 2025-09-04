import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

const AdminRoute = () => {
  const { user, loading, isInitialized } = useSelector((state) => state.auth);

  console.log("AdminRoute user:", user, "loading:", loading, "isInitialized:", isInitialized);

  // Wait for authentication to be initialized
  if (!isInitialized || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("AdminRoute: No user, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Check if user has admin role
  if (user.role === "admin" || "super_admin") {
    return <Outlet />;
  } else {
    console.warn("AdminRoute unauthorized access, user role:", user.role);
    return <Navigate to="/unauthorized" />;
  }
};

export default AdminRoute;
