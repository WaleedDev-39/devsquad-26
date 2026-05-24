const Plan = require("../models/Plan");
const User = require("../models/User");

// @desc    Get all subscription plans
// @route   GET /api/plans
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a plan (Admin)
// @route   POST /api/plans
const createPlan = async (req, res) => {
  try {
    const { title, description, price, duration, features } = req.body;

    if (!title || !description || price === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Title, description, and price are required." });
    }

    const plan = await Plan.create({
      title,
      description,
      price,
      duration: duration || "monthly",
      features: features || [],
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate free trial
// @route   POST /api/plans/trial
const activateTrial = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user already used trial
    if (user.subscription.isTrial) {
      return res.status(400).json({
        success: false,
        message: "You have already used your free trial.",
      });
    }

    // Check if user already has active subscription
    if (user.subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription.",
      });
    }

    // Get basic plan for trial
    const basicPlan = await Plan.findOne().sort({ price: 1 });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14-day free trial

    user.subscription = {
      plan: basicPlan ? basicPlan._id : null,
      startDate,
      endDate,
      isActive: true,
      isTrial: true,
      cardDetails: user.subscription.cardDetails,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Free trial activated! Enjoy 14 days of free streaming.",
      subscription: {
        startDate,
        endDate,
        isActive: true,
        isTrial: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe to a plan (with card details)
// @route   POST /api/plans/subscribe
const subscribe = async (req, res) => {
  try {
    const { planId, cardNumber, cardHolder, expiryDate, cvv } = req.body;

    if (!planId || !cardNumber || !cardHolder || !expiryDate || !cvv) {
      return res.status(400).json({
        success: false,
        message: "Plan ID and card details are required.",
      });
    }

    // Validate card number (basic check)
    if (cardNumber.replace(/\s/g, "").length < 13) {
      return res.status(400).json({
        success: false,
        message: "Invalid card number.",
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found." });
    }

    const user = await User.findById(req.user._id);

    const startDate = new Date();
    const endDate = new Date();
    if (plan.duration === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Store card details (masked for security)
    const maskedCard = cardNumber.replace(/\s/g, "");
    user.subscription = {
      plan: plan._id,
      startDate,
      endDate,
      isActive: true,
      isTrial: false,
      cardDetails: {
        cardNumber: "****" + maskedCard.slice(-4),
        cardHolder,
        expiryDate,
        cvv: "***",
      },
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: `Subscribed to ${plan.title} successfully!`,
      subscription: {
        plan: plan.title,
        startDate,
        endDate,
        isActive: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current subscription status
// @route   GET /api/plans/status
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("subscription.plan");

    // Check if subscription has expired
    if (
      user.subscription.isActive &&
      user.subscription.endDate &&
      new Date(user.subscription.endDate) < new Date()
    ) {
      user.subscription.isActive = false;
      await user.save();
    }

    res.status(200).json({
      success: true,
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  activateTrial,
  subscribe,
  getSubscriptionStatus,
};
