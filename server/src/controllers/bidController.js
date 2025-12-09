const prisma = require("../models");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendRes } = require("../utils/sendRes");

 // Create a new bid on a project
exports.createBid = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const { amount, estimatedDuration, message } = req.body;
  const sellerId = req.user.id;

  // Check if project exists and is still open for bids
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  if (project.status !== "PENDING") {
    return next(new ErrorHandler("Project is no longer accepting bids", 400));
  }

  // Check if seller already placed a bid on this project
  const existingBid = await prisma.bid.findFirst({
    where: {
      projectId,
      sellerId,
    },
  });

  if (existingBid) {
    return next(new ErrorHandler("You have already placed a bid on this project", 400));
  }

  // Create bid
  const bid = await prisma.bid.create({
    data: {
      amount: parseFloat(amount),
      estimatedDuration: parseInt(estimatedDuration),
      message,
      projectId,
      sellerId,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  sendRes(201, res, bid, "Bid placed successfully")
});


// Get all bids for a project
exports.getProjectBids = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;

  // Check if project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  // Check if user is authorized to view bids
  if (project.buyerId !== req.user.id && req.user.userType !== "SELLER") {
    return next(
      new ErrorHandler("You are not authorized to view bids for this project"),
      403
    );
  }

  // Get bids
  const bids = await prisma.bid.findMany({
    where: { projectId },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  sendRes(200, res, bids)
});

// Get all bids placed by the current seller
exports.getMyBids = catchAsyncErrors(async (req, res, next) => {
  const sellerId = req.user.id;

  // Get bids
  const bids = await prisma.bid.findMany({
    where: { sellerId },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          status: true,
          budgetMin: true,
          budgetMax: true,
          deadline: true,
          sellerId: true,
          buyer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  sendRes(200, res, bids)
});


// Update a bid
// Only allowed if project is still in PENDING status
exports.updateBid = catchAsyncErrors(async (req, res, next) => {
  const { bidId } = req.params;
  const { amount, estimatedDuration, message } = req.body;
  const sellerId = req.user.id;

  // Check if bid exists
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: true,
    },
  });

  if (!bid) {
    return next(new ErrorHandler("Bid not found", 404));
  }

  // Check if user is the seller who placed the bid
  if (bid.sellerId !== sellerId) {
    return next(
      new ErrorHandler("You are not authorized to update this bid", 403)
    );
  }

  // Check if project is still in PENDING status
  if (bid.project.status !== "PENDING") {
    return next(
      new ErrorHandler(
        "Bid can only be updated if project is still open for bids"
      ),
      400
    );
  }

  // Update bid
  const updatedBid = await prisma.bid.update({
    where: { id: bidId },
    data: {
      amount: parseFloat(amount),
      estimatedDuration: parseInt(estimatedDuration),
      message,
    },
  });

  res.json({
    message: "Bid updated successfully",
    bid: updatedBid,
  });

  sendRes(200, res, updatedBid, "Bid updated successfully");
});

 // Delete a bid
 // Only allowed if project is still in PENDING status
exports.deleteBid = catchAsyncErrors(async (req, res, next) => {
  const { bidId } = req.params;
  const sellerId = req.user.id;

  // Check if bid exists
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: true,
    },
  });

  if (!bid) {
    return next(new ErrorHandler("Bid not found", 404));
  }

  // Check if user is the seller who placed the bid
  if (bid.sellerId !== sellerId) {
    return next(
      new ErrorHandler("You are not authorized to delete this bid", 403)
    );
  }

  // Check if project is still in PENDING status
  if (bid.project.status !== "PENDING") {
    return next(
      new ErrorHandler(
        "Bid can only be deleted if project is still open for bids",
        400
      )
    );
  }

  // Delete bid
  await prisma.bid.delete({
    where: { id: bidId },
  });

  sendRes(200, res, "", "Bid deleted successfully");
});
