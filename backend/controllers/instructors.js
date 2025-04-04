const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Public
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Public
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await User.findOne({
      _id: req.params.id,
      role: 'instructor'
    }).select('-password');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Get instructor's courses
    const courses = await Course.find({ instructor: req.params.id });

    res.status(200).json({
      success: true,
      data: {
        instructor,
        courses
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create instructor
// @route   POST /api/instructors
// @access  Private/Admin
exports.createInstructor = async (req, res) => {
  try {
    // Add instructor role to the request body
    req.body.role = 'instructor';

    const instructor = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: instructor
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private/Admin
exports.updateInstructor = async (req, res) => {
  try {
    let instructor = await User.findOne({
      _id: req.params.id,
      role: 'instructor'
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Prevent role from being changed
    delete req.body.role;

    instructor = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private/Admin
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await User.findOne({
      _id: req.params.id,
      role: 'instructor'
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: 'Instructor not found'
      });
    }

    // Check if instructor has any courses
    const courses = await Course.find({ instructor: req.params.id });
    if (courses.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete instructor with existing courses'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}; 