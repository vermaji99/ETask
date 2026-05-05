const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// Helper to check DB connection
const checkDBConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const state = states[mongoose.connection.readyState] || 'unknown';
    res.status(503);
    throw new Error(`Database connection is ${state}. Please ensure MongoDB is running.`);
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  checkDBConnection(res);
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  checkDBConnection(res);
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json(result);
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Get all members
// @route   GET /api/auth/members
// @access  Private (Admin only)
const getMembers = asyncHandler(async (req, res) => {
  const members = await authService.getMembers();
  res.status(200).json(members);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getMembers,
};
