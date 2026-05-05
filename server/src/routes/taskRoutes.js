const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  getStats,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

const validateTask = [
  check('project', 'Project ID is required').not().isEmpty(),
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('deadline', 'Valid deadline is required').isISO8601(),
  check('assignedTo', 'Assigned user is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

router.post('/', protect, admin, validateTask, createTask);
router.get('/project/:projectId', protect, getProjectTasks);
router.put('/:id', protect, updateTaskStatus);
router.get('/stats', protect, getStats);

module.exports = router;
