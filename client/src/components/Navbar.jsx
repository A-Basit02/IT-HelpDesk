import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { LogOut, LogIn, UserPlus, LayoutDashboard, Ticket, PlusCircle } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate ("/login") ;
  };

  return (
    <AppBar position="static" color="primary" sx={{ width: "100%" }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to={user ? (user.role === "admin" ? "/admin/profile" : "/profile") : "/"}
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🎫 Help Desk
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {!user && (
              <>
                <MenuItem onClick={handleCloseNavMenu} component={Link} to="/login">
                  <LogIn size={18} style={{ marginRight: 8 }} />
                  Login
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu} component={Link} to="/signup">
                  <UserPlus size={18} style={{ marginRight: 8 }} />
                  Signup
                </MenuItem>
              </>
            )}
            {user?.role === "user" && (
              <>
                <MenuItem onClick={handleCloseNavMenu} component={Link} to="/user/dashboard">
                  <LayoutDashboard size={18} style={{ marginRight: 8 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu} component={Link} to="/user/create-ticket">
                  <PlusCircle size={18} style={{ marginRight: 8 }} />
                  Create Ticket
                </MenuItem>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <MenuItem onClick={handleCloseNavMenu} component={Link} to="/admin/dashboard">
                  <LayoutDashboard size={18} style={{ marginRight: 8 }} />
                  Dashboard
                </MenuItem>
              </>
            )}
            {user && (
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  handleLogout();
                }}
              >
                <LogOut size={18} style={{ marginRight: 8 }} />
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
          {!user && (
            <>
              <Button
                component={Link}
                to="/login"
                startIcon={<LogIn size={18} />}
                sx={{ color: "white", textTransform: "none", marginRight: 2 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                startIcon={<UserPlus size={18} />}
                sx={{ color: "white", textTransform: "none" }}
              >
                Signup
              </Button>
            </>
          )}
          {user?.role === "user" && (
            <>
              <Button
                component={Link}
                to="/user/dashboard"
                startIcon={<LayoutDashboard size={18} />}
                sx={{ color: "white", textTransform: "none", marginRight: 2 }}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/user/create-ticket"
                startIcon={<PlusCircle size={18} />}
                sx={{ color: "white", textTransform: "none", marginRight: 2 }}
              >
                Create Ticket
              </Button>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Button
                component={Link}
                to="/admin/dashboard"
                startIcon={<LayoutDashboard size={18} />}
                sx={{ color: "white", textTransform: "none", marginRight: 2 }}
              >
                Dashboard
              </Button>
              {/* <Button
                component={Link}
                to="/admin/tickets"
                startIcon={<Ticket size={18} />}
                sx={{ color: "white", textTransform: "none", marginRight: 2 }}
              >
                View Tickets
              </Button>
              <Button
                component={Link}
                to="/admin/edit/:ticketNumber"
                startIcon={<Ticket size={18} />}
                sx={{ color: "white", textTransform: "none" }}
              >
                Edit Tickets
              </Button> */}
            </>
          )}
          {user && (
            <Button onClick={handleLogout} sx={{ color: "white", textTransform: "none" }} startIcon={<LogOut size={18} />}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
