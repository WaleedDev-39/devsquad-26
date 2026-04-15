const express = require("express");
const router = express.Router();
const {
  getUsers,
  blockUser,
  unblockUser,
  getStats,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// All admin routes require auth + admin middleware
router.use(auth, admin);

router.get("/users", getUsers);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.get("/stats", getStats);

module.exports = router;
