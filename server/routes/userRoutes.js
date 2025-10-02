const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {adminAuth, superAdminAuth, adminORsuperAdmin} = require('../middleware/adminAuth');
const {
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
} = require('../controllers/userController');


// Public routes (no authentication required) - MUST come before parameterized routes
router.post('/forgotPassword', requestPasswordReset);
router.post('/verifyOTP', verifyOtp);
router.put('/resetPassword', resetPassword);

// User profile routes (for any authenticated user)
router.get('/profile/me', verifyToken, getCurrentUserProfile);
router.put('/profile/me', verifyToken, updateCurrentUserProfile);

// Admin routes (require admin privileges) - parameterized routes come last
router.get('/all',  adminORsuperAdmin ,getAllUsersController);
router.get('/:id', adminORsuperAdmin, getUserByIdController);
router.put('/:id', adminAuth, updateUserController);
router.delete('/:id', adminORsuperAdmin, deleteUserController);
// SuperAdmin Route
router.put('/:id/approval', superAdminAuth, updateUserStatusController);

module.exports = router; 