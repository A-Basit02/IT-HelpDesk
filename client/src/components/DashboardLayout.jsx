import React, { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import logo from '../assets/logo.png';
import ConfirmationDialog from './ConfirmationDialog';
import { Users } from "lucide-react";

const drawerWidth = 220;

const navLinks = {
  guest: [
    { to: "/login", label: "Login", icon: <LoginIcon /> },
    { to: "/signup", label: "Signup", icon: <PersonAddIcon /> },
  ],
  user: [
    { to: "/user/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/user/create-ticket", label: "Create Ticket", icon: <AddCircleIcon /> },
    { to: "/profile", label: "Profile", icon: <AccountCircleIcon /> },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/admin/profile", label: "Profile", icon: <AccountCircleIcon /> },
    { to: "/admin/users", label: "User Management", icon: <PersonAddIcon /> },
  ],
};

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setSnackbarOpen(true);
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1200);
  };

  let links = navLinks.guest;
  if (user?.role === "user") links = navLinks.user;
  if (user?.role === "admin") links = navLinks.admin;

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
        <Box component={Link} to={user ? (user.role === "admin" ? "/admin/profile" : "/profile") : "/"} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Box component="img" src={logo} alt="Logo" sx={{ width: 36, height: 36, mr: 1, borderRadius: '8px' }} />
          <Typography variant="h6" noWrap sx={{ color: "inherit", fontWeight: "bold" }}>
            Help Desk 
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {links.map((item) => (
          <ListItem button key={item.to} component={Link} to={item.to} onClick={() => setMobileOpen(false)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ fontSize: '1.5rem' }} />
          </ListItem>
        ))}
        {user && (
          <ListItem button onClick={() => setLogoutDialogOpen(true)}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 , fontSize: ' 2rem' }}>
            Help Desk 
          </Typography>
          {user && (
            <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} startIcon={<LogoutIcon />}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: "none", md: "block" }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth , fontSize: '1.5rem' } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
        <Snackbar open={snackbarOpen} autoHideDuration={1200} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            Logout successful
          </Alert>
        </Snackbar>
      </Box>
      <ConfirmationDialog
        open={logoutDialogOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          setLogoutDialogOpen(false);
          handleLogout();
        }}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </Box>
  );
} 