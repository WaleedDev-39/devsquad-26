const router = require("express").Router();
const {
  getProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
  getCategories,
  getFilterOptions,
} = require("../controllers/productController");
const { authenticate, authorize } = require("../middlewares/auth");

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/filters", getFilterOptions);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post("/", authenticate, authorize("admin", "superadmin"), createProduct);
router.put("/:id", authenticate, authorize("admin", "superadmin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin", "superadmin"), deleteProduct);

// Variant routes
router.post("/variants", authenticate, authorize("admin", "superadmin"), createVariant);
router.put("/variants/:id", authenticate, authorize("admin", "superadmin"), updateVariant);
router.delete("/variants/:id", authenticate, authorize("admin", "superadmin"), deleteVariant);

module.exports = router;
