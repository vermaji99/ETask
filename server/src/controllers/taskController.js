const taskService = require('../services/taskService');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin only)
const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user._id);
  res.status(201).json(task);
});

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getProjectTasks(req.params.projectId);
  res.status(200).json(tasks);
});

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateTaskStatus(req.params.id, req.body.status, req.user._id);
  res.status(200).json(task);
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const stats = await taskService.getStats(req.user);
  res.status(200).json(stats);
});

module.exports = {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  getStats,
};
