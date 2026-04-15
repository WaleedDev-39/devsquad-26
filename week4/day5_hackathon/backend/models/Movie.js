const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    genre: {
      type: [String],
      required: [true, "At least one genre is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    cast: [
      {
        name: { type: String },
        image: { type: String },
      },
    ],
    director: {
      name: { type: String },
      image: { type: String },
    },
    music: {
      name: { type: String },
      image: { type: String },
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    ratings: {
      imdb: { type: Number, default: 0 },
      streamvibe: { type: Number, default: 0 },
    },
    type: {
      type: String,
      enum: ["movie", "show"],
      default: "movie",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
