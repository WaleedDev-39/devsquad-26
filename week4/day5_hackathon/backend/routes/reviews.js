const express = require("express");
const router = express.Router();
const { getReviews, addReview, deleteReview } = require("../controllers/reviewController");
const auth = require("../middleware/auth");

// Public routes
router.get("/:movieId", getReviews);

// Protected routes
router.post("/", auth, addReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;
