const { check, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const validateProject = [
  check('name', 'Project name is required').not().isEmpty().trim(),
  check('description', 'Description is required').not().isEmpty().trim(),
  handleValidationErrors
];

module.exports = {
  validateProject
};
