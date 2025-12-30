const bcrypt = require("bcryptjs");
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  updateUserPassword, 
  deleteUser,
  getUserByEmployeeID, 
  setResetOTP, 
  verifyResetExpiry,
  clearResetOTP
} = require("../models/userModel");
const { sendEmail } = require("../utils/emailService"); // ✅ Correct import

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
    const { name, email, employeeID, department, branch, role, password, approval_status } = req.decryptedBody;
    
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
      role: role || existingUser.role,
      approval_status: approval_status || existingUser.approval_status
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
      console.log ('Existing user ', existingUser);
      return res.status(404).sendEncrypted({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    console.log ('Exixting user employee ID', existingUser.employeeID);
    // if (existingUser.employeeID === req.adminUser.employeeID) {
    //   return res.status(400).sendEncrypted({ message: 'Cannot delete your own account' });
    // }
    
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

// Super Admin can also approve/reject with audit email
const updateUserStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.decryptedBody || req.body || {};
    const { name, email, employeeID, department, branch, role, password, approval_status } = body;

    if (!id) {
      return res.status(400).sendEncrypted({ message: "User ID is required" });
    }

    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).sendEncrypted({ message: "User not found" });
    }

    // Prepare update data
    const updateData = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      employeeID: employeeID || existingUser.employeeID,
      department: department || existingUser.department,
      branch: branch || existingUser.branch,
      role: role || existingUser.role,
      approval_status: approval_status || existingUser.approval_status,
    };

    // Detect changed fields
    const changedFields = [];
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] != existingUser[key]) {
        changedFields.push({
          field: key,
          old: existingUser[key],
          new: updateData[key],
        });
      }
    });

    // Update user basic info
    await updateUser(id, updateData);

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await updateUserPassword(id, hashedPassword);
      changedFields.push({ field: "password", old: "******", new: "******" });
    }

    // Prepare tagline
    let tagline = null;
    if (approval_status === "Approved") {
      tagline = "Your account has been approved ✅";
    } else if (approval_status === "Rejected") {
      tagline = "Your account has been rejected ❌";
    } else if (changedFields.length > 0) {
      tagline = "Your account information has been updated ✨";
    }

    // Send email
    if (changedFields.length > 0 && existingUser.email) {
      let details = "";
      changedFields.forEach((change) => {
        details += `- ${change.field}: "${change.old}" → "${change.new}"\n`;
      });

      const emailBody = `Hello ${existingUser.name},\n\n${tagline}.\n\nChanges made:\n${details}\n\nRegards,\nSuper Admin Team`;

      await sendEmail(existingUser.email, "Account Update Notification", emailBody);
    }

    res.sendEncrypted({
      message: "User updated successfully",
      approval_status: updateData.approval_status,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).sendEncrypted({ message: "Server error", error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { employeeID } = req.body;
    
    if (!employeeID) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    
    // Check if user exists
    const user = await getUserByEmployeeID(employeeID);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    
    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 5 minutes from now
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    
    // Save OTP to database
    await setResetOTP(employeeID, otp, expiry);
    
    // Send email with OTP
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Hello ${user.name}, \n\n Your Password Reset OTP is \n \t\t ${otp} \n\n Don't share this OTP with anyone \n In case of any issue please reach out to our official email: ithelpdesk@mbl.com`
    );

    res.json({ message: "Check your mail for OTP" });
  } catch (error) {
    console.error("Error in requesting OTP:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { employeeID, otp } = req.body;
    
    if (!employeeID || !otp) {
      return res
        .status(400)
        .json({ message: "Employee ID or OTP is missing" });
    }

    const user = await verifyResetExpiry(employeeID);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.resetExpiry) < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    res.json({ message: "OTP Verified Successfully" });
  } catch (error) {
    console.error("Error in verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { employeeID, newPassword } = req.body;

    if (!employeeID || !newPassword) {
      return res.status(400).json({ message: "Employee ID and New Password is required" });
    }
    
    const user = await verifyResetExpiry(employeeID);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (new Date(user.resetExpiry) < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.employeeID, hashedPassword);
    await clearResetOTP(employeeID);

    res.json({ message: "Password updated Successfully" });
  } catch (error) {
    console.error("Error in updating password:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getCurrentUserProfile,
  updateCurrentUserProfile, 
  updateUserStatusController, 
  requestPasswordReset,
  verifyOtp,
  resetPassword
}; 