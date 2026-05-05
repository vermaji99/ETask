const projectService = require('../services/projectService');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user._id);
  res.status(201).json(project);
});

// @desc    Get all projects user belongs to
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user);
  res.status(200).json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user._id);
  res.status(200).json(project);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = asyncHandler(async (req, res) => {
  const id = await projectService.deleteProject(req.params.id, req.user._id);
  res.status(200).json({ id });
});

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin only)
const addMember = asyncHandler(async (req, res) => {
  const project = await projectService.addMember(req.params.id, req.body.userId, req.user._id);
  res.status(200).json(project);
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  addMember,
};
