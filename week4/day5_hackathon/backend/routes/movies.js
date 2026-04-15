const express = require("express");
const router = express.Router();
const {
  getMovies,
  getMovieById,
  streamMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  uploadVideo,
  toggleVisibility,
  uploadThumbnailHandler,
  upload,
  uploadThumbnail,
} = require("../controllers/movieController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Public routes
router.get("/", getMovies);
router.get("/:id", getMovieById);

// Protected routes (requires auth)
router.get("/:id/stream", auth, streamMovie);

// Admin routes
router.post("/", auth, admin, createMovie);
router.put("/:id", auth, admin, updateMovie);
router.delete("/:id", auth, admin, deleteMovie);
router.post("/upload", auth, admin, upload.single("video"), uploadVideo);
router.post("/upload-thumbnail", auth, admin, uploadThumbnail.single("thumbnail"), uploadThumbnailHandler);
router.put("/:id/visibility", auth, admin, toggleVisibility);

module.exports = router;
