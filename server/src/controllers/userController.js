// src/controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models');
const ErrorHandler = require('../utils/ErrorHandler');
const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { SendToken } = require('../utils/sendJWTToken');
const { sendRes } = require('../utils/sendRes');


 // Register a new user
exports.register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return next( new ErrorHandler('User with this email already exists', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    SendToken(user, 201, res, "Successfully Registered");
});

// Login user
exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return next( new ErrorHandler('Invalid credentials', 401));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next( new ErrorHandler('Invalid credentials', 401));
    }

    SendToken(user, 201, res, "Successfully Login");
});

// Get current user profile
exports.getProfile = catchAsyncErrors(async (req, res, next) => {
    // User is already added to req by auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true
      }
    });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    sendRes(200, res, user, "");
});

// Update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        updatedAt: true
      }
    });

    sendRes(200, res, updatedUser, "Profile updated successfully");
});

exports.userLogout = catchAsyncErrors(async (req, res, next) => {

    // const updatedUser = await prisma.user.findUnique({
    //   where: { id: req.user.id }
    // });
    res.clearCookie(`user-token`);
    sendRes(200, res, null, "Logout successfully");
});