const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    label: { type: String, required: true },
    weight: { type: String, required: true },
    priceDifference: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Variant", variantSchema);
