const router = require("express").Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middlewares/auth");

router.use(authenticate);

router.post("/", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/all", authorize("admin", "superadmin"), getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", authorize("admin", "superadmin"), updateOrderStatus);

module.exports = router;
