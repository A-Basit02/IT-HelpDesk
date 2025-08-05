const verifyToken = require('./verifyToken');
const { getUserByEmployeeID } = require('../models/userModel');

const adminAuth = async (req, res, next) => {
  try {
    // First verify the token
    await verifyToken(req, res, async () => {
      const { employeeID } = req.user;
      
      // Get user details to check role
      const user = await getUserByEmployeeID(employeeID);
      
      if (!user) {
        return res.status(404).sendEncrypted({ message: 'User not found' });
      }
      
      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).sendEncrypted({ message: 'Access denied. Admin privileges required.' });
      }
      
      // Add user info to request for use in controllers
      req.adminUser = user;
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).sendEncrypted({ message: 'Server error' });
  }
};

module.exports = adminAuth; 