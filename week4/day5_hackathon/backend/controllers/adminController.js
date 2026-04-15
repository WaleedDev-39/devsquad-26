const User = require("../models/User");

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: "user" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block a user (Admin)
// @route   PUT /api/admin/users/:id/block
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot block an admin user." });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been blocked.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unblock a user (Admin)
// @route   PUT /api/admin/users/:id/unblock
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been unblocked.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const Movie = require("../models/Movie");
    const Review = require("../models/Review");

    const totalUsers = await User.countDocuments({ role: "user" });
    const blockedUsers = await User.countDocuments({
      role: "user",
      isBlocked: true,
    });
    const activeSubscriptions = await User.countDocuments({
      "subscription.isActive": true,
    });
    const totalMovies = await Movie.countDocuments({ type: "movie" });
    const totalShows = await Movie.countDocuments({ type: "show" });
    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        blockedUsers,
        activeSubscriptions,
        totalMovies,
        totalShows,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, blockUser, unblockUser, getStats };
