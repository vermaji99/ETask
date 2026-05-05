const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  addMember,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

const validateProject = [
  check('name', 'Project name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

router.post('/', protect, admin, validateProject, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.delete('/:id', protect, admin, deleteProject);
router.put('/:id/members', protect, admin, addMember);

module.exports = router;
