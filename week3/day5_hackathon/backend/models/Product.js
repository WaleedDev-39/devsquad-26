const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Black Tea", "Green Tea", "White Tea", "Matcha", "Herbal Tea", "Chai", "Oolong", "Rooibos", "Teaware"],
      required: true,
    },
    origin: { type: String, default: "" },
    flavor: [{ type: String }],
    qualities: [{ type: String }],
    caffeine: { type: String, enum: ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"], default: "Medium Caffeine" },
    allergens: [{ type: String }],
    organic: { type: Boolean, default: false },
    vegan: { type: Boolean, default: true },
    images: [{ type: String }],
    stepiingInstructions: {
      servingSize: { type: String, default: "" },
      waterTemperature: { type: String, default: "" },
      steepingTime: { type: String, default: "" },
      colorAfterBrew: { type: String, default: "" },
    },
    ingredients: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
