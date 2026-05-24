const express   = require('express');
const { body }  = require('express-validator');
const router    = express.Router();

const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// ── Validation rules ──────────────────────────────────────────────────────

const registerRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email')
    .trim().isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role')
    .optional()
    .isIn(['Admin', 'Analyst', 'Viewer']).withMessage('Role must be Admin, Analyst, or Viewer.'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

// ── Routes ────────────────────────────────────────────────────────────────

// Public routes
router.post('/register', registerRules, register);
router.post('/login',    loginRules,    login);

// Protected routes (require valid JWT)
router.get('/me',              authMiddleware, getMe);
router.put('/profile',         authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
