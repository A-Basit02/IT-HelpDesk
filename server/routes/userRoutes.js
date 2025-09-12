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
  updateUserStatusController
} = require('../controllers/userController');

// Admin routes (require admin privileges)
router.get('/all',  adminORsuperAdmin ,getAllUsersController);
router.get('/:id', adminORsuperAdmin, getUserByIdController);
router.put('/:id', adminAuth, updateUserController);
router.delete('/:id', adminORsuperAdmin, deleteUserController);
// SuperAdmin Route
router.put('/:id/approval', superAdminAuth, updateUserStatusController);


// User profile routes (for any authenticated user)
router.get('/profile/me', verifyToken, getCurrentUserProfile);
router.put('/profile/me', verifyToken, updateCurrentUserProfile);

module.exports = router; 