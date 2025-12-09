// src/middleware/auth.js

const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/ErrorHandler");
const prisma = require('../models');

// Authentication middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // If no token in header, check cookies
    else if (req.cookies && req.cookies['user-token']) {
      token = req.cookies['user-token'];
    }
    
    // If no token found in either place
    if (!token) {
      return next(new ErrorHandler("No token provided", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new ErrorHandler('Invalid or expired token', 400));
    } else {
      next(error);
    }
  }
};

// Authorization middleware to check user role
// Array of allowed roles
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler('User not authenticated', 400));
    }

    if (!roles.includes(req.user.userType)) {
      return next(new ErrorHandler('User not authorized for this action', 400));
    }

    next();
  };
};

// Middleware to check if user is the buyer of a project
exports.isBuyerOfProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return next(new NotFoundError('Project not found'));
    }

    if (project.buyerId !== userId) {
      return next(new ForbiddenError('You are not authorized to perform this action'));
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};


// Middleware to check if user is the seller of a project
exports.isSellerOfProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return next(new NotFoundError('Project not found'));
    }

    if (project.sellerId !== userId) {
      return next(new ForbiddenError('You are not authorized to perform this action'));
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};