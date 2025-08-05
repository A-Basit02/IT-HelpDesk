import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Redux actions
import {
  fetchAllUsers,
  updateUserById,
  deleteUserById,
  createNewUser,
  clearError,
  clearSuccess,
  setSearchTerm,
  setFilterRole
} from '../../redux/userSlice';

// Components
import UserTable from '../../components/user/UserTable';
import UserForm from '../../components/user/UserForm';
import DeleteUserDialog from '../../components/user/DeleteUserDialog';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error, 
    success, 
    searchTerm, 
    filterRole 
  } = useSelector((state) => state.users);

  // Local state
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.branch.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    return filtered;
  }, [users, searchTerm, filterRole]);

  // Handle search
  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Handle role filter
  const handleRoleFilter = (e) => {
    dispatch(setFilterRole(e.target.value));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchAllUsers());
  };

  // Handle add new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle view user (for future implementation)
  const handleViewUser = (user) => {
    // TODO: Implement user detail view
    console.log('View user:', user);
  };

  // Handle form submit
  const handleFormSubmit = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        await dispatch(updateUserById({ userId: selectedUser.id, userData })).unwrap();
        toast.success('User updated successfully');
      } else {
        // Create new user
        await dispatch(createNewUser(userData)).unwrap();
        toast.success('User created successfully');
      }
      setFormOpen(false);
      setSelectedUser(null);
      // Refresh user list
      dispatch(fetchAllUsers());
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteUserById(userToDelete.id)).unwrap();
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      // Refresh user list
      dispatch(fetchAllUsers());
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  // Get statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;
    
    return { totalUsers, adminUsers, regularUsers };
  }, [users]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          fontWeight: 'bold'
        }}>
          <PeopleIcon fontSize="large" color="primary" />
          User Management
        </Typography>
        
        {/* Statistics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip 
            label={`Total Users: ${stats.totalUsers}`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`Admins: ${stats.adminUsers}`} 
            color="error" 
            variant="outlined"
          />
          <Chip 
            label={`Regular Users: ${stats.regularUsers}`} 
            color="info" 
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 , width: '100%'}}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3} >
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                onChange={handleRoleFilter}
                label="Filter by Role"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddUser}
              startIcon={<AddIcon />}
              sx={{ 
                backgroundColor: 'success.main',
                '&:hover': { backgroundColor: 'success.dark' }
              }}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || filterRole !== 'all' 
              ? 'No users found matching your criteria' 
              : 'No users found'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filterRole !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by adding your first user'
            }
          </Typography>
        </Paper>
      ) : (
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
        />
      )}

      {/* User Form Dialog */}
      <UserForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        loading={loading}
        error={error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        user={userToDelete}
        loading={loading}
        error={error}
      />
    </Container>
  );
};

export default UserManagement; 