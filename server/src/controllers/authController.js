const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');

const mongoose = require('mongoose');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const state = states[mongoose.connection.readyState] || 'unknown';
    res.status(503);
    throw new Error(`Database connection is ${state}. Please ensure MongoDB is running and accessible (Local or Atlas).`);
  }

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Member',
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const state = states[mongoose.connection.readyState] || 'unknown';
    res.status(503);
    throw new Error(`Database connection is ${state}. Please ensure MongoDB is running and accessible (Local or Atlas).`);
  }

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
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
  const members = await User.find({ role: 'Member' }).select('-password');
  res.status(200).json(members);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getMembers,
};
