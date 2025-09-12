import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  TableSortLabel,
  TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const UserTable = ({ users, onEdit, onDelete }) => {
  // Default sort by id desc
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

 
  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle date sorting
      if (orderBy === 'id') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        // Handle string sorting
        aValue = aValue?.toString().toLowerCase();
        bValue = bValue?.toString().toLowerCase();
      }

      if (order === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return sorted;
  }, [users, orderBy, order]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!users || users.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No users found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start by adding your first user
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ boxShadow: 2, borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(90, 4, 131)" }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 60 }}>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'employeeID'}
                  direction={orderBy === 'employeeID' ? order : 'asc'}
                  onClick={() => handleRequestSort('employeeID')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  Employee ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'department'}
                  direction={orderBy === 'department' ? order : 'asc'}
                  onClick={() => handleRequestSort('department')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  Department
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'branch'}
                  direction={orderBy === 'branch' ? order : 'asc'}
                  onClick={() => handleRequestSort('branch')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  Branch
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleRequestSort('role')}
                  sx={{ color: 'white', '&.MuiTableSortLabel-icon': { color: 'white' } }}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                  '&:hover': { backgroundColor: 'grey.100' },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{user.id}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {user.email}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {user.employeeID}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {user.department}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {user.branch}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={user.role.toUpperCase()}
                    color={getRoleColor(user.role)}
                    size="small"
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                  />
                </TableCell>
                
                
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  
                    
                    <Tooltip title="Edit User">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onEdit(user)}
                        sx={{
                          backgroundColor: 'warning.light',
                          color: 'white',
                          '&:hover': { backgroundColor: 'warning.main' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(user)}
                        sx={{
                          backgroundColor: 'error.light',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.main' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />
    </Paper>
  );
};

export default UserTable; 