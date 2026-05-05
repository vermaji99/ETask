const Project = require('../models/Project');

/**
 * Create a new project
 * @param {Object} projectData 
 * @param {string} adminId 
 * @returns {Object} Created project
 */
const createProject = async (projectData, adminId) => {
  const { name, description, members } = projectData;
  return await Project.create({
    name,
    description,
    admin: adminId,
    members: members || [],
  });
};

/**
 * Get all projects for a user
 * @param {Object} user 
 * @returns {Array} List of projects
 */
const getProjects = async (user) => {
  if (user.role === 'Admin') {
    return await Project.find({ admin: user._id }).populate('members', 'name email');
  } else {
    return await Project.find({ members: user._id }).populate('admin', 'name email');
  }
};

/**
 * Get project by ID
 * @param {string} id 
 * @param {string} userId 
 * @returns {Object} Project
 */
const getProjectById = async (id, userId) => {
  const project = await Project.findById(id)
    .populate('members', 'name email')
    .populate('admin', 'name email');

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  // Check authorization
  const isMember = project.members.some((m) => m._id.toString() === userId.toString());
  const isAdmin = project.admin._id.toString() === userId.toString();

  if (!isAdmin && !isMember) {
    const error = new Error('Not authorized to view this project');
    error.statusCode = 403;
    throw error;
  }

  return project;
};

/**
 * Delete project
 * @param {string} id 
 * @param {string} adminId 
 * @returns {string} Deleted project ID
 */
const deleteProject = async (id, adminId) => {
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (project.admin.toString() !== adminId.toString()) {
    const error = new Error('Not authorized to delete this project');
    error.statusCode = 403;
    throw error;
  }

  await project.deleteOne();
  return id;
};

/**
 * Add member to project
 * @param {string} projectId 
 * @param {string} userId 
 * @param {string} adminId 
 * @returns {Object} Updated project
 */
const addMember = async (projectId, userId, adminId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (project.admin.toString() !== adminId.toString()) {
    const error = new Error('Not authorized to manage members');
    error.statusCode = 403;
    throw error;
  }

  if (project.members.includes(userId)) {
    const error = new Error('User already a member');
    error.statusCode = 400;
    throw error;
  }

  project.members.push(userId);
  await project.save();

  return project;
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  addMember,
};
