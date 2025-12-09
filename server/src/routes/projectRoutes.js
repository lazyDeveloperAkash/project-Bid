// src/routes/projectRoutes.js

const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validator');
const { cancelProject, confirmProjectCompletion, markProjectAsCompleted, selectSeller, updateProject, getProjectById, getMyAssignedProjects, getMyProjects, getAllProjects, createProject, addDeliverable } = require('../controllers/projectController');
const { upload } = require('../services/uploadService');

const router = express.Router();

// Validation middleware
const createProjectValidation = [
  body('title').notEmpty().withMessage('Project title is required'),
  body('description').notEmpty().withMessage('Project description is required'),
  body('budgetMin')
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  body('budgetMax')
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number')
    .custom((value, { req }) => {
      if (parseFloat(value) <= parseFloat(req.body.budgetMin)) {
        throw new Error('Maximum budget must be greater than minimum budget');
      }
      return true;
    }),
  body('deadline')
    .isISO8601()
    .withMessage('Deadline must be a valid date')
    .custom((value) => {
      const deadline = new Date(value);
      const now = new Date();
      if (deadline <= now) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
  validateRequest
];

const updateProjectValidation = [
  param('projectId').isUUID().withMessage('Invalid project ID'),
  ...createProjectValidation
];

const selectSellerValidation = [
  param('projectId').isUUID().withMessage('Invalid project ID'),
  body('bidId').isUUID().withMessage('Invalid bid ID'),
  validateRequest
];

const projectIdValidation = [
  param('projectId').isUUID().withMessage('Invalid project ID'),
  validateRequest
];

// Routes
router.post(
  '/',
  authenticate,
  authorize(['BUYER']),
  createProjectValidation,
  createProject
);

router.get(
  '/',
  authenticate,
  getAllProjects
);

router.get(
  '/my-projects',
  authenticate,
  authorize(['BUYER']),
  getMyProjects
);

router.get(
  '/my-assigned-projects',
  authenticate,
  authorize(['SELLER']),
  getMyAssignedProjects
);

router.get(
  '/:projectId',
  authenticate,
  projectIdValidation,
  getProjectById
);

router.put(
  '/:projectId',
  authenticate,
  authorize(['BUYER']),
  updateProjectValidation,
  updateProject
);

router.post(
  '/:projectId/select-seller',
  authenticate,
  authorize(['BUYER']),
  selectSellerValidation,
  selectSeller
);

router.post(
  '/:projectId/deliverables',
  authenticate,
  authorize(['SELLER']),
  projectIdValidation,
  upload.array('files', 10),
  addDeliverable
);

router.patch(
  '/:projectId/complete',
  authenticate,
  authorize(['SELLER']),
  projectIdValidation,
  markProjectAsCompleted
);

router.patch(
  '/:projectId/confirm-completion',
  authenticate,
  authorize(['BUYER']),
  projectIdValidation,
  confirmProjectCompletion
);

router.post(
  '/:projectId/cancel',
  authenticate,
  authorize(['BUYER']),
  projectIdValidation,
  cancelProject
);

module.exports = router;