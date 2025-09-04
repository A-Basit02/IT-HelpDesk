const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {adminAuth, superAdminAuth} = require('../middleware/adminAuth');
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
router.get('/all', adminAuth, getAllUsersController);
router.get('/:id', adminAuth, getUserByIdController);
router.put('/:id', adminAuth, updateUserController);
router.delete('/:id', adminAuth, deleteUserController);
// SuperAdmin Route
router.put('/:id/approval', updateUserStatusController);
router.get('/all', getAllUsersController);


// User profile routes (for any authenticated user)
router.get('/profile/me', verifyToken, getCurrentUserProfile);
router.put('/profile/me', verifyToken, updateCurrentUserProfile);

module.exports = router; 