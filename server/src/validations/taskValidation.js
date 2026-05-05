const { check, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const validateTask = [
  check('project', 'Project ID is required').not().isEmpty(),
  check('title', 'Title is required').not().isEmpty().trim(),
  check('description', 'Description is required').not().isEmpty().trim(),
  check('deadline', 'Valid deadline is required').isISO8601(),
  check('assignedTo', 'Assigned user is required').not().isEmpty(),
  handleValidationErrors
];

module.exports = {
  validateTask
};
