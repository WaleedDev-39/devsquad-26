const router = require("express").Router();
const {
  getAnalytics,
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserRole,
} = require("../controllers/adminController");
const { authenticate, authorize } = require("../middlewares/auth");

router.use(authenticate, authorize("admin", "superadmin"));

router.get("/analytics", getAnalytics);
router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.put("/users/:id/role", authorize("superadmin"), updateUserRole);

module.exports = router;
