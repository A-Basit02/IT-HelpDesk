import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unauthorized from "./pages/auth/unauthorized";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import CreateTicket from "./pages/user/CreateTicket";
import AdminProfile from "./pages/admin/Profile";
import UserProfile from "./pages/user/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import TicketDetails from "./pages/user/TicketDetails";
import AdminTicketDetails from "./pages/admin/TicketDetails";
import UserManagement from "./pages/admin/UserManagement";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "./redux/authSlice";
import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/"
          element={<Navigate to="/login" />} />
        {/* User Routes */}
        <Route element={<UserRoute />}>
          <Route
            element={<DashboardLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/create-ticket" element={<CreateTicket />} />
            <Route path="/user/tickets/:ticketNumber" element={<TicketDetails />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route
            element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/tickets/:ticketNumber" element={<AdminTicketDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
