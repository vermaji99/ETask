const express = require('express');
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  getStats,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateTask } = require('../validations/taskValidation');

router.post('/', protect, admin, validateTask, createTask);
router.get('/project/:projectId', protect, getProjectTasks);
router.put('/:id', protect, updateTaskStatus);
router.get('/stats', protect, getStats);

module.exports = router;
