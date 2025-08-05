const bcrypt = require("bcryptjs");
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  updateUserPassword, 
  deleteUser,
  getUserByEmployeeID 
} = require("../models/userModel");

// Get all users (admin only)
const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.sendEncrypted({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).sendEncrypted({ message: 'Server error', error: error.message });
  }
};

// Get user by ID (admin only)
const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).sendEncrypted({ message: 'User ID is required' });
    }
    
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).sendEncrypted({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.sendEncrypted({
      message: 'User retrieved successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).sendEncrypted({ message: 'Server error', error: error.message });
  }
};

// Update user (admin only)
const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, employeeID, department, branch, role, password } = req.decryptedBody;
    
    if (!id) {
      return res.status(400).sendEncrypted({ message: 'User ID is required' });
    }
    
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).sendEncrypted({ message: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      employeeID: employeeID || existingUser.employeeID,
      department: department || existingUser.department,
      branch: branch || existingUser.branch,
      role: role || existingUser.role
    };
    
    // Update user basic info
    await updateUser(id, updateData);
    
    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await updateUserPassword(id, hashedPassword);
    }
    
    res.sendEncrypted({
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).sendEncrypted({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).sendEncrypted({ message: 'User ID is required' });
    }
    
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).sendEncrypted({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (existingUser.employeeID === req.adminUser.employeeID) {
      return res.status(400).sendEncrypted({ message: 'Cannot delete your own account' });
    }
    
    // Delete user
    await deleteUser(id);
    
    res.sendEncrypted({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).sendEncrypted({ message: 'Server error', error: error.message });
  }
};

// Get current user profile (for any authenticated user)
const getCurrentUserProfile = async (req, res) => {
  try {
    const { employeeID } = req.user;
    
    const user = await getUserByEmployeeID(employeeID);
    
    if (!user) {
      return res.status(404).sendEncrypted({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.sendEncrypted({
      message: 'Profile retrieved successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get current user profile error:', error);
    res.status(500).sendEncrypted({ message: 'Server error', error: error.message });
  }
};

// Update current user profile (for any authenticated user)
const updateCurrentUserProfile = async (req, res) => {
  try {
    const { employeeID } = req.user;
    const { name, email, department, branch, currentPassword, newPassword } = req.decryptedBody;
    
    // Get current user
    const currentUser = await getUserByEmployeeID(employeeID);
    if (!currentUser) {
      return res.status(404).sendEncrypted({ message: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      name: name || currentUser.name,
      email: email || currentUser.email,
      employeeID: currentUser.employeeID, // Cannot change employeeID
      department: department || currentUser.department,
      branch: branch || currentUser.branch,
      role: currentUser.role // Cannot change role
    };
    
    // Update user basic info
    await updateUser(currentUser.id, updateData);
    
    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).sendEncrypted({ message: 'Current password is required to change password' });
      }
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).sendEncrypted({ message: 'Current password is incorrect' });
      }
      
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await updateUserPassword(currentUser.id, hashedNewPassword);
    }
    
    res.sendEncrypted({
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update current user profile error:', error);
    res.status(500).sendEncrypted({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getCurrentUserProfile,
  updateCurrentUserProfile
}; 