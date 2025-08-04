import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

const UserRoute = () => {
  const { user, loading, isInitialized } = useSelector((state) => state.auth);

  console.log("UserRoute user:", user, "loading:", loading, "isInitialized:", isInitialized);

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
    console.log("UserRoute: No user, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Check if user has correct role
  if (user.role && user.role.toLowerCase() === "user") {
    return <Outlet />;
  } else {
    console.warn("UserRoute unauthorized access, user role:", user.role);
    return <Navigate to="/unauthorized" />;
  }
};

export default UserRoute;
