const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  deleteProject,
  addMember,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateProject } = require('../validations/projectValidation');

router.post('/', protect, admin, validateProject, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.delete('/:id', protect, admin, deleteProject);
router.put('/:id/members', protect, admin, addMember);

module.exports = router;
