const express = require('express');
const router = express.Router();
const { login, register, getLoggedInUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getLoggedInUser);

module.exports = router;
