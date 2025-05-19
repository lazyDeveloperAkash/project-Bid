const prisma = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { sendRes } = require("../utils/sendRes");

exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const { score, comment } = req.body;

  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) return next(new ErrorHandler("Project not found!", 404));

  if (project.status !== "COMPLETED")
    return next(new ErrorHandler("Project not in complete state", 403));

  if (project.buyerId !== req.user.id)
    return next(new ErrorHandler("You are not the authorized user!", 403));

  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: {
      rating: {
        create: {
          score,
          comment,
          fromUserId: project.buyerId,
          toUserId: project.sellerId,
        },
      },
    },
  });

  sendRes(201, res, updatedProject, "review posted");
});
