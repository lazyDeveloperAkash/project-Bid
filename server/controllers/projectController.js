// src/controllers/projectController.js

const prisma = require("../models");
const {
  sendSellerSelectionNotification,
  sendProjectCompletionNotification,
} = require("../services/emailService");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendRes } = require("../utils/sendRes");
const { getFileUrl, getFileUrls } = require("../services/uploadService");

// Create a new project
exports.createProject = catchAsyncErrors(async (req, res, next) => {
  const { title, description, budgetMin, budgetMax, deadline } = req.body;
  const buyerId = req.user.id;

  // Create project
  const project = await prisma.project.create({
    data: {
      title,
      description,
      budgetMin: parseFloat(budgetMin),
      budgetMax: parseFloat(budgetMax),
      deadline: new Date(deadline),
      buyerId,
      // Create initial status update
      statusUpdates: {
        create: {
          status: "PENDING",
          comment: "Project created and open for bids",
        },
      },
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      statusUpdates: true,
    },
  });

  sendRes(201, res, project, "Project created successfully");
});

// Get all projects
// With filtering options
exports.getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const { status, minBudget, maxBudget } = req.query;

  // Build filter conditions
  const where = {};

  if (status) {
    where.status = status;
  }

  if (minBudget) {
    where.budgetMin = { gte: parseFloat(minBudget) };
  }

  if (maxBudget) {
    where.budgetMax = { lte: parseFloat(maxBudget) };
  }

  // Get projects
  const projects = await prisma.project.findMany({
    where,
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          bids: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  sendRes(200, res, projects, "");
});

// Get projects created by the current user (buyer)
exports.getMyProjects = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const projects = await prisma.project.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          bids: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  sendRes(200, res, projects, "");
});

// Get projects assigned to the current user (seller)
exports.getMyAssignedProjects = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const projects = await prisma.project.findMany({
    where: {
      sellerId: userId,
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  sendRes(200, res, projects);
});

// Get a single project by ID
exports.getProjectById = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      bids: {
        include: {
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          amount: "asc",
        },
      },
      statusUpdates: {
        orderBy: {
          createdAt: "desc",
        },
      },
      rating: {
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  sendRes(200, res, project);
});

// Update a project
// Only allowed if project is in PENDING status
exports.updateProject = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const { title, description, budgetMin, budgetMax, deadline } = req.body;
  const userId = req.user.id;

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // Check if user is the buyer
  if (project.buyerId !== userId) {
    return next(
      new ErrorHandler("You are not authorized to update this project", 403)
    );
  }

  // Check if project is in PENDING status
  if (project.status !== "PENDING") {
    return next(
      new ErrorHandler(
        "Project can only be updated when in PENDING status",
        400
      )
    );
  }

  // Update project
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      title,
      description,
      budgetMin: parseFloat(budgetMin),
      budgetMax: parseFloat(budgetMax),
      deadline: new Date(deadline),
    },
  });

  sendRes(200, res, updatedProject, "Project updated successfully");
});


// upload deliveries by seller
exports.addDeliverable = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Get project details to verify it's in the correct state
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      buyer: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // match project status
  if (project.status !== "COMPLETED") {
    return next(
      new ErrorHandler(
        "Deliverables can only be uploaded for projects that are in progress",
        403
      )
    );
  }

  // match project seller
  if (project.sellerId !== req.user.id) {
    return next(
      new ErrorHandler(
        "Deliverables can only be uploaded by authrizes seller",
        403
      )
    );
  }

  // Generate file URL
  const fileUrls = getFileUrls(files, projectId, req);
  console.log(fileUrls);

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      deliverables: fileUrls,
    },
  });

  sendRes(200, res, updatedProject, "File Uploaded Successfully");
});

// Select a seller for a project
// Only allowed if project is in PENDING status
exports.selectSeller = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const { bidId } = req.body;
  const userId = req.user.id;

  // Get project with bid
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      bids: {
        where: { id: bidId },
        include: {
          seller: true,
        },
      },
    },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // Check if user is the buyer
  if (project.buyerId !== userId) {
    return next(
      new ErrorHandler(
        "You are not authorized to select a seller for this project",
        403
      )
    );
  }

  // Check if project is in PENDING status
  if (project.status !== "PENDING") {
    return next(
      new ErrorHandler(
        "Seller can only be selected when project is in PENDING status",
        400
      )
    );
  }

  // Check if bid exists
  if (project.bids.length === 0) {
    return next(new ErrorHandler("Bid not found", 404));
  }

  const selectedBid = project.bids[0];
  const seller = selectedBid.seller;

  // Update project status and set seller
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "IN_PROGRESS",
      sellerId: seller.id,
      statusUpdates: {
        create: {
          status: "IN_PROGRESS",
          comment: `Seller ${seller.name} selected for the project`,
        },
      },
    },
    include: {
      buyer: true,
      seller: true,
      statusUpdates: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  // Send email notification to seller
  await sendSellerSelectionNotification(
    seller.email,
    seller.name,
    updatedProject
  );

  sendRes(200, res, updatedProject, "Seller selected successfully");
});

// Mark project as completed by seller
// Only allowed if project is in IN_PROGRESS status
exports.markProjectAsCompleted = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      buyer: true,
      seller: true,
    },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // Check if user is the seller
  if (project.sellerId !== userId) {
    return next(
      new ErrorHandler(
        "You are not authorized to mark this project as completed",
        403
      )
    );
  }

  // Check if project is in IN_PROGRESS status
  if (project.status !== "IN_PROGRESS") {
    return next(
      new ErrorHandler(
        "Project can only be marked as completed when in IN_PROGRESS status",
        403
      )
    );
  }

  // Update project status
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "CONFIRM",
      statusUpdates: {
        create: {
          status: "CONFIRM",
          comment: "Project marked as completed by seller",
        },
      },
    },
  });

  // Send email notification to buyer
  await sendProjectCompletionNotification(
    project.buyer.email,
    project.buyer.name,
    project,
    true
  );

  sendRes(200, res, updatedProject, "Project Submited");
});

// Confirm project completion by buyer
// Only allowed if project is in COMPLETED status
exports.confirmProjectCompletion = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      buyer: true,
      seller: true,
    },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // Check if user is the buyer
  if (project.buyerId !== userId) {
    return next(
      new ErrorHandler(
        "You are not authorized to confirm this project completion",
        403
      )
    );
  }

  // Check if project is already marked as completed by seller
  if (project.status !== "CONFIRM") {
    return next(
      new ErrorHandler(
        "Project must be marked as Confirm by the seller first",
        400
      )
    );
  }

  // Update project status
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "COMPLETED",
      statusUpdates: {
        create: {
          status: "COMPLETED",
          comment: "Project marked as completed by seller",
        },
      },
    },
  });

  // Send email notification to seller
  await sendProjectCompletionNotification(
    project.seller.email,
    project.seller.name,
    project,
    false
  );

  sendRes(200, res, updatedProject, "Project completion confirmed");
});

// Cancel a project
// Only allowed if project is in PENDING status
exports.cancelProject = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // Check if user is the buyer
  if (project.buyerId !== userId) {
    return next(
      new ErrorHandler("You are not authorized to cancel this project", 403)
    );
  }

  // Check if project is in PENDING status
  if (project.status !== "PENDING") {
    return next(
      new ErrorHandler(
        "Project can only be canceled when in PENDING status",
        403
      )
    );
  }

  // Update project status
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "CANCELLED",
      statusUpdates: {
        create: {
          status: "CANCELLED",
          comment: "Project canceled by buyer",
        },
      },
    },
  });

  sendRes(200, res, updatedProject, "Project canceled successfully");
});
