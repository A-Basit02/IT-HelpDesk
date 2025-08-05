import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const UserCard = ({ user, onEdit, onDelete, onView }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with name and role */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {user.name}
            </Typography>
          </Box>
          <Chip 
            label={user.role.toUpperCase()} 
            color={getRoleColor(user.role)}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* User details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Email */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {user.email}
            </Typography>
          </Box>

          {/* Employee ID */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              ID: {user.employeeID}
            </Typography>
          </Box>

          {/* Department */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.department}
            </Typography>
          </Box>

          {/* Branch */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.branch}
            </Typography>
          </Box>

          {/* Created date */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Created: {formatDate(user.createdAt)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => onView(user)}
              sx={{ 
                backgroundColor: 'primary.light',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.main' }
              }}
            >
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
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
      </CardActions>
    </Card>
  );
};

export default UserCard; 