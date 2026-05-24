const express = require("express");
const router = express.Router();
const {
  getPlans,
  createPlan,
  activateTrial,
  subscribe,
  getSubscriptionStatus,
} = require("../controllers/planController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Public routes
router.get("/", getPlans);

// Protected routes
router.post("/trial", auth, activateTrial);
router.post("/subscribe", auth, subscribe);
router.get("/status", auth, getSubscriptionStatus);

// Admin routes
router.post("/create", auth, admin, createPlan);

module.exports = router;
