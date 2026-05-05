const Task = require('../models/Task');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin only)
const createTask = asyncHandler(async (req, res) => {
  const { project, title, description, deadline, assignedTo } = req.body;

  if (!project || !title || !description || !deadline || !assignedTo) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if project exists and user is admin
  const projectObj = await Project.findById(project);
  if (!projectObj) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (projectObj.admin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only project admin can create tasks');
  }

  const task = await Task.create({
    project,
    title,
    description,
    deadline,
    assignedTo,
  });

  res.status(201).json(task);
});

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
  res.status(200).json(tasks);
});

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user is assigned to task or is admin of project
  const project = await Project.findById(task.project);
  if (
    task.assignedTo.toString() !== req.user._id.toString() &&
    project.admin.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task.status = status || task.status;
  await task.save();

  res.status(200).json(task);
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  let tasks;
  if (req.user.role === 'Admin') {
    // Admin sees stats for projects they manage
    const projects = await Project.find({ admin: req.user._id });
    const projectIds = projects.map((p) => p._id);
    tasks = await Task.find({ project: { $in: projectIds } }).populate('project', 'name').populate('assignedTo', 'name');
  } else {
    // Member sees stats for tasks assigned to them
    tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name');
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Done').length,
    pending: tasks.filter((t) => t.status !== 'Done').length,
    overdue: tasks.filter((t) => t.status !== 'Done' && new Date(t.deadline) < new Date()).length,
    recentTasks: tasks.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5)
  };

  res.status(200).json(stats);
});

module.exports = {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  getStats,
};
