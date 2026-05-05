const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Create a new task
 * @param {Object} taskData 
 * @param {string} adminId 
 * @returns {Object} Created task
 */
const createTask = async (taskData, adminId) => {
  const { project, title, description, deadline, assignedTo } = taskData;

  // Check if project exists and user is admin
  const projectObj = await Project.findById(project);
  if (!projectObj) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (projectObj.admin.toString() !== adminId.toString()) {
    const error = new Error('Only project admin can create tasks');
    error.statusCode = 403;
    throw error;
  }

  return await Task.create({
    project,
    title,
    description,
    deadline,
    assignedTo,
  });
};

/**
 * Get all tasks for a project
 * @param {string} projectId 
 * @returns {Array} List of tasks
 */
const getProjectTasks = async (projectId) => {
  return await Task.find({ project: projectId }).populate('assignedTo', 'name email');
};

/**
 * Update task status
 * @param {string} taskId 
 * @param {string} status 
 * @param {string} userId 
 * @returns {Object} Updated task
 */
const updateTaskStatus = async (taskId, status, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is assigned to task or is admin of project
  const project = await Project.findById(task.project);
  const isAssigned = task.assignedTo.toString() === userId.toString();
  const isAdmin = project.admin.toString() === userId.toString();

  if (!isAssigned && !isAdmin) {
    const error = new Error('Not authorized to update this task');
    error.statusCode = 403;
    throw error;
  }

  task.status = status || task.status;
  await task.save();

  return task;
};

/**
 * Get dashboard stats
 * @param {Object} user 
 * @returns {Object} Stats
 */
const getStats = async (user) => {
  let tasks;
  if (user.role === 'Admin') {
    const projects = await Project.find({ admin: user._id });
    const projectIds = projects.map((p) => p._id);
    tasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'name')
      .populate('assignedTo', 'name');
  } else {
    tasks = await Task.find({ assignedTo: user._id }).populate('project', 'name');
  }

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Done').length,
    pending: tasks.filter((t) => t.status !== 'Done').length,
    overdue: tasks.filter((t) => t.status !== 'Done' && new Date(t.deadline) < new Date()).length,
    recentTasks: tasks.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5),
  };
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  getStats,
};
