const Project = require('../models/Project');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
const createProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;

  if (!name || !description) {
    res.status(400);
    throw new Error('Please add name and description');
  }

  const project = await Project.create({
    name,
    description,
    admin: req.user._id,
    members: members || [],
  });

  res.status(201).json(project);
});

// @desc    Get all projects user belongs to
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({ admin: req.user._id }).populate('members', 'name email');
  } else {
    projects = await Project.find({ members: req.user._id }).populate('admin', 'name email');
  }
  res.status(200).json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email')
    .populate('admin', 'name email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is admin or member
  if (
    project.admin._id.toString() !== req.user._id.toString() &&
    !project.members.some((m) => m._id.toString() === req.user._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to view this project');
  }

  res.status(200).json(project);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.admin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  await project.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin only)
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.admin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to manage members');
  }

  if (project.members.includes(userId)) {
    res.status(400);
    throw new Error('User already a member');
  }

  project.members.push(userId);
  await project.save();

  res.status(200).json(project);
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  addMember,
};
