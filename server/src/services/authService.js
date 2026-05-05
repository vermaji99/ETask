const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {Object} User data and token
 */
const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Member',
  });

  if (!user) {
    const error = new Error('Invalid user data');
    error.statusCode = 400;
    throw error;
  }

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Authenticate user
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} User data and token
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
};

/**
 * Get all members
 * @returns {Array} List of members
 */
const getMembers = async () => {
  return await User.find({ role: 'Member' }).select('-password');
};

module.exports = {
  registerUser,
  loginUser,
  getMembers,
};
