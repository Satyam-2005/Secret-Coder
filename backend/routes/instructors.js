const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (to be implemented)
const {
  getInstructors,
  getInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor
} = require('../controllers/instructors');

router
  .route('/')
  .get(getInstructors)
  .post(protect, authorize('admin'), createInstructor);

router
  .route('/:id')
  .get(getInstructor)
  .put(protect, authorize('admin', 'instructor'), updateInstructor)
  .delete(protect, authorize('admin'), deleteInstructor);

module.exports = router; 