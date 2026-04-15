const Movie = require("../models/Movie");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage for video uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "streamvibe/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "avi", "mkv", "mov", "webm"],
  },
});

const upload = multer({ storage });

// Cloudinary storage for thumbnail/image uploads
const thumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "streamvibe/thumbnails",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const uploadThumbnail = multer({ storage: thumbnailStorage });

// @desc    Get all movies/shows
// @route   GET /api/movies
const getMovies = async (req, res) => {
  try {
    const { type, genre, search, page = 1, limit = 20 } = req.query;
    const query = { isVisible: true };

    if (type) query.type = type;
    if (genre) query.genre = { $in: [genre] };
    if (search) query.title = { $regex: search, $options: "i" };

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      movies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single movie/show by ID
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    res.status(200).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stream movie (get video URL) - requires active subscription
// @route   GET /api/movies/:id/stream
const streamMovie = async (req, res) => {
  try {
    const user = req.user;

    // Check subscription status
    if (
      !user.subscription.isActive ||
      (user.subscription.endDate && new Date(user.subscription.endDate) < new Date())
    ) {
      return res.status(403).json({
        success: false,
        message: "Active subscription required to stream content.",
      });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    if (!movie.videoUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Video not available." });
    }

    res.status(200).json({
      success: true,
      streamUrl: movie.videoUrl,
      movie: {
        title: movie.title,
        duration: movie.duration,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new movie/show (Admin)
// @route   POST /api/movies
const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      duration,
      releaseYear,
      thumbnail,
      videoUrl,
      cast,
      director,
      music,
      languages,
      ratings,
      type,
    } = req.body;

    if (!title || !description || !genre || !duration || !releaseYear) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing." });
    }

    const movie = await Movie.create({
      title,
      description,
      genre: Array.isArray(genre) ? genre : [genre],
      duration,
      releaseYear,
      thumbnail: thumbnail || "",
      videoUrl: videoUrl || "",
      cast: cast || [],
      director: director || {},
      music: music || {},
      languages: languages || ["English"],
      ratings: ratings || { imdb: 0, streamvibe: 0 },
      type: type || "movie",
    });

    res.status(201).json({
      success: true,
      message: "Movie created successfully.",
      movie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a movie/show (Admin)
// @route   PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully.",
      movie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a movie/show (Admin)
// @route   DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload video to Cloudinary (Admin)
// @route   POST /api/movies/upload
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No video file uploaded." });
    }

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully.",
      videoUrl: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle movie visibility (Admin)
// @route   PUT /api/movies/:id/visibility
const toggleVisibility = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    movie.isVisible = !movie.isVisible;
    await movie.save();

    res.status(200).json({
      success: true,
      message: `Movie is now ${movie.isVisible ? "visible" : "hidden"}.`,
      movie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload thumbnail to Cloudinary (Admin)
// @route   POST /api/movies/upload-thumbnail
const uploadThumbnailHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded." });
    }

    res.status(200).json({
      success: true,
      message: "Thumbnail uploaded successfully.",
      thumbnailUrl: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
