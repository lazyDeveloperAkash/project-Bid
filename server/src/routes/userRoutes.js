// src/routes/userRoutes.js

const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validator');
const { register, login, getProfile, updateProfile, userLogout } = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('userType')
    .isIn(['BUYER', 'SELLER'])
    .withMessage('User type must be either BUYER or SELLER'),
  validateRequest
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

const updateProfileValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  validateRequest
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, updateProfile);
router.post('/logout', authenticate, userLogout);

module.exports = router;