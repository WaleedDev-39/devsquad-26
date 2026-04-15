const Review = require("../models/Review");

// @desc    Get reviews for a movie
// @route   GET /api/reviews/:movieId
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a review
// @route   POST /api/reviews
const addReview = async (req, res) => {
  try {
    const { movieId, rating, text, location } = req.body;

    if (!movieId || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: "movieId, rating, and text are required.",
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      movieId,
      userId: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this movie.",
      });
    }

    const review = await Review.create({
      movieId,
      userId: req.user._id,
      userName: req.user.name,
      location: location || "Unknown",
      rating,
      text,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Only allow the review owner or admin to delete
    if (
      review.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review.",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };
