import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = () => {
  const { user, loading, isInitialized } = useSelector((state) => state.auth);

  console.log("PrivateRoute user:", user, "loading:", loading, "isInitialized:", isInitialized);

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
    console.log("PrivateRoute: No user, redirecting to login");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
