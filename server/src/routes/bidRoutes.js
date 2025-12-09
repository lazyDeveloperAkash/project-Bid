// src/routes/bidRoutes.js

const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validator');
const { createBid, getProjectBids, getMyBids, updateBid, deleteBid } = require('../controllers/bidController');

const router = express.Router();

// Validation middleware
const createBidValidation = [
  param('projectId').isUUID().withMessage('Invalid project ID'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Bid amount must be a positive number'),
  body('estimatedDuration')
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
  body('message')
    .notEmpty()
    .withMessage('Bid message is required'),
  validateRequest
];

const updateBidValidation = [
  param('bidId').isUUID().withMessage('Invalid bid ID'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Bid amount must be a positive number'),
  body('estimatedDuration')
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
  body('message')
    .notEmpty()
    .withMessage('Bid message is required'),
  validateRequest
];

const bidIdValidation = [
  param('bidId').isUUID().withMessage('Invalid bid ID'),
  validateRequest
];

const projectIdValidation = [
  param('projectId').isUUID().withMessage('Invalid project ID'),
  validateRequest
];

// Routes
router.post(
  '/projects/:projectId',
  authenticate,
  authorize(['SELLER']),
  createBidValidation,
  createBid
);

router.get(
  '/projects/:projectId',
  authenticate,
  projectIdValidation,
  getProjectBids
);

router.get(
  '/my-bids',
  authenticate,
  authorize(['SELLER']),
  getMyBids
);

router.put(
  '/:bidId',
  authenticate,
  authorize(['SELLER']),
  updateBidValidation,
  updateBid
);

router.delete(
  '/:bidId',
  authenticate,
  authorize(['SELLER']),
  bidIdValidation,
  deleteBid
);

module.exports = router;