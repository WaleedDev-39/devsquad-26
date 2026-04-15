const router = require("express").Router();
const { signup, login, getProfile, validateToken } = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.get("/validate", authenticate, validateToken);

module.exports = router;
