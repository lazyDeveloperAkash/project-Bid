const express = require("express");
const { createReview } = require("../controllers/reviewController");
const { body, param } = require("express-validator");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

const createReviewValidation = [
  body("score")
    .isInt({ min: 1 })
    .withMessage("minimum rating you can give is 1")
    .isInt({ max: 5 })
    .withMessage("Maximum rating you can give is 5"),
  body("comment").notEmpty().withMessage("Comment is required"),
  param("projectId").isUUID().withMessage("Please provide a valid project id"),
];

router.post("/create/:projectId", authenticate, createReviewValidation, createReview);

module.exports = router;
