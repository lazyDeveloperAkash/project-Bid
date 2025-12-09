// src/middleware/validator.js

const { validationResult } = require('express-validator');
const ErrorHandler = require('../utils/ErrorHandler');

/**
 * Middleware to validate request data using express-validator
 */
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.path}: ${err.msg}`);
    return next(new ErrorHandler(errorMessages.join(', ')), 400);
  }
  next();
};
