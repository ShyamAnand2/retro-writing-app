// AUTHENTICATION ROUTES: Define endpoints for user registration and login

import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// VALIDATION RULES: Ensures user input is correct before processing
const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// ROUTES
// POST /api/auth/signup - Register new user
router.post('/signup', signupValidation, validate, signup);

// POST /api/auth/login - Login existing user
router.post('/login', loginValidation, validate, login);

// GET /api/auth/me - Get current user (protected route)
router.get('/me', protect, getMe);

export default router;
