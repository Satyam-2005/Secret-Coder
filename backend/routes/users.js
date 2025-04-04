const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (to be implemented)
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router
  .route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router; 