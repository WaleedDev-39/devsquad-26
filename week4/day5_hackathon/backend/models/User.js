const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    subscription: {
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        default: null,
      },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      isActive: { type: Boolean, default: false },
      isTrial: { type: Boolean, default: false },
      cardDetails: {
        cardNumber: { type: String, default: null },
        cardHolder: { type: String, default: null },
        expiryDate: { type: String, default: null },
        cvv: { type: String, default: null },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
