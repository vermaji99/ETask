const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getMembers,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../validations/authValidation');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);
router.get('/members', protect, admin, getMembers);

module.exports = router;
