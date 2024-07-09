const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticateToken, authenticateAdminToken } = require('../middleware/auth');

// User Registration
router.post('/signup', userController.signUp);

// User login
router.post('/login', userController.login);

// User Details
router.get('/details', authenticateToken, userController.details);

// Update details
router.put('/update', authenticateToken, userController.updateDetails);

// Delete user
router.delete('/delete/:id', authenticateAdminToken, userController.deleteUser);

module.exports = router;
