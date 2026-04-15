import React, { useState, useEffect } from "react";
import API from "../../api";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(false);

  const emptyForm = {
    title: "",
    description: "",
    genre: "",
    duration: "",
    releaseYear: "",
    thumbnail: "",
    videoUrl: "",
    type: "movie",
    languages: "English",
    "ratings.imdb": 0,
    "ratings.streamvibe": 0,
    cast: "",
    "director.name": "",
    "director.image": "",
    "music.name": "",
    "music.image": "",
  };

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [pagination.page, typeFilter]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 10 };
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;

      // Use admin perspective - get all movies including hidden
      const { data } = await API.get("/movies", { params });
      if (data.success) {
        setMovies(data.movies);
        setPagination((prev) => ({
          ...prev,
          pages: data.pagination.pages,
          total: data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchMovies();
  };

  const openCreateModal = () => {
    setEditingMovie(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setForm({
      title: movie.title || "",
      description: movie.description || "",
      genre: movie.genre?.join(", ") || "",
      duration: movie.duration || "",
      releaseYear: movie.releaseYear || "",
      thumbnail: movie.thumbnail || "",
      videoUrl: movie.videoUrl || "",
      type: movie.type || "movie",
      languages: movie.languages?.join(", ") || "English",
      "ratings.imdb": movie.ratings?.imdb || 0,
      "ratings.streamvibe": movie.ratings?.streamvibe || 0,
      cast: movie.cast?.map((c) => c.name).join(", ") || "",
      "director.name": movie.director?.name || "",
      "director.image": movie.director?.image || "",
      "music.name": movie.music?.name || "",
      "music.image": movie.music?.image || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploadProgress(true);
      const { data } = await API.post("/movies/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setForm((prev) => ({ ...prev, videoUrl: data.videoUrl }));
      }
    } catch (error) {
      setFormError("Video upload failed. Please try again.");
    } finally {
      setUploadProgress(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);

    try {
      setThumbUploadProgress(true);
      const { data } = await API.post("/movies/upload-thumbnail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setForm((prev) => ({ ...prev, thumbnail: data.thumbnailUrl }));
      }
    } catch (error) {
      setFormError("Thumbnail upload failed. Please try again.");
    } finally {
      setThumbUploadProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title || !form.description || !form.genre || !form.duration || !form.releaseYear) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      genre: form.genre.split(",").map((g) => g.trim()).filter(Boolean),
      duration: form.duration,
      releaseYear: parseInt(form.releaseYear),
      thumbnail: form.thumbnail,
      videoUrl: form.videoUrl,
      type: form.type,
      languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
      ratings: {
        imdb: parseFloat(form["ratings.imdb"]) || 0,
        streamvibe: parseFloat(form["ratings.streamvibe"]) || 0,
      },
      cast: form.cast
        ? form.cast.split(",").map((name) => ({ name: name.trim(), image: "" }))
        : [],
      director: {
        name: form["director.name"],
        image: form["director.image"],
      },
      music: {
        name: form["music.name"],
        image: form["music.image"],
      },
    };

    try {
      setFormLoading(true);
      if (editingMovie) {
        const { data } = await API.put(`/movies/${editingMovie._id}`, payload);
        if (data.success) {
          setMovies((prev) =>
            prev.map((m) => (m._id === editingMovie._id ? data.movie : m))
          );
        }
      } else {
        const { data } = await API.post("/movies", payload);
        if (data.success) {
          fetchMovies();
        }
      }
      setShowModal(false);
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to save movie.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      setActionLoading(movieId);
      await API.delete(`/movies/${movieId}`);
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVisibility = async (movieId) => {
    try {
      setActionLoading(movieId);
      const { data } = await API.put(`/movies/${movieId}/visibility`);
      if (data.success) {
        setMovies((prev) =>
          prev.map((m) =>
            m._id === movieId ? { ...m, isVisible: data.movie.isVisible } : m
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-white">Movies & Shows</h1>
          <p className="text-[#999] text-[14px] mt-1">
            {pagination.total} total entries
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#E50000] hover:bg-red-700 text-white px-5 py-3 rounded-lg text-[14px] font-medium transition-all"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies & shows..."
              className="w-full bg-[#1A1A1A] border border-[#262626] rounded-lg pl-10 pr-4 py-3 text-white text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-[#262626] hover:bg-[#333] text-white px-5 py-3 rounded-lg text-[14px] transition-all"
          >
            Search
          </button>
        </form>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="bg-[#1A1A1A] border border-[#262626] rounded-lg px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#E50000]"
        >
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="show">Shows</option>
        </select>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="w-8 h-8 border-3 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className={`bg-[#1A1A1A] border rounded-xl overflow-hidden transition-all hover:border-[#333] ${
                  movie.isVisible ? "border-[#262626]" : "border-red-500/30 opacity-60"
                }`}
              >
                {/* Thumbnail */}
                <div className="h-40 bg-[#262626] relative overflow-hidden">
                  {movie.thumbnail ? (
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#555]">
                      <Film size={40} />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      movie.type === "movie"
                        ? "bg-[#E50000]/80 text-white"
                        : "bg-purple-500/80 text-white"
                    }`}
                  >
                    {movie.type === "movie" ? "Movie" : "Show"}
                  </span>
                  {!movie.isVisible && (
                    <span className="absolute top-2 left-2 text-[11px] px-2 py-0.5 rounded-full bg-red-500/80 text-white font-medium">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[16px] mb-1 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[#999] text-[12px] mb-3 line-clamp-2">
                    {movie.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#999] mb-4">
                    <span>{movie.releaseYear}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                    <span>•</span>
                    <span>{movie.genre?.slice(0, 2).join(", ")}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(movie)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#262626] hover:bg-[#333] text-white py-2 rounded-lg text-[12px] transition-all"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(movie._id)}
                      disabled={actionLoading === movie._id}
                      className="flex items-center justify-center gap-1.5 bg-[#262626] hover:bg-[#333] text-white py-2 px-3 rounded-lg text-[12px] transition-all disabled:opacity-50"
                      title={movie.isVisible ? "Hide" : "Show"}
                    >
                      {movie.isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      disabled={actionLoading === movie._id}
                      className="flex items-center justify-center gap-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 py-2 px-3 rounded-lg text-[12px] transition-all disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center text-[#999] py-16 text-[14px]">
              No movies or shows found.
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                }
                disabled={pagination.page === 1}
                className="bg-[#1A1A1A] border border-[#262626] text-white p-2 rounded-lg disabled:opacity-30 hover:bg-[#262626] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[#999] text-[14px]">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))
                }
                disabled={pagination.page === pagination.pages}
                className="bg-[#1A1A1A] border border-[#262626] text-white p-2 rounded-lg disabled:opacity-30 hover:bg-[#262626] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-[#1A1A1A] border border-[#262626] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hide">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#262626] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white text-[20px] font-bold">
                {editingMovie ? "Edit Movie/Show" : "Add New Movie/Show"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#999] hover:text-white p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {formError && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-[13px]">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-[#999] mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                    placeholder="e.g. Avengers: Endgame"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-[#999] mb-1.5">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={3}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors resize-none"
                    placeholder="Movie/show description..."
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000]"
                  >
                    <option value="movie">Movie</option>
                    <option value="show">Show</option>
                  </select>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Genres * (comma-separated)</label>
                  <input
                    type="text"
                    value={form.genre}
                    onChange={(e) => handleFormChange("genre", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                    placeholder="Action, Drama, Sci-Fi"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Duration *</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => handleFormChange("duration", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                    placeholder="2h 30min"
                  />
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Release Year *</label>
                  <input
                    type="number"
                    value={form.releaseYear}
                    onChange={(e) => handleFormChange("releaseYear", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                    placeholder="2024"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Languages (comma-separated)</label>
                  <input
                    type="text"
                    value={form.languages}
                    onChange={(e) => handleFormChange("languages", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                    placeholder="English, Hindi, Tamil"
                  />
                </div>

                {/* IMDb Rating */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form["ratings.imdb"]}
                    onChange={(e) => handleFormChange("ratings.imdb", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-[#999] mb-1.5">Thumbnail</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={form.thumbnail}
                      onChange={(e) => handleFormChange("thumbnail", e.target.value)}
                      className="flex-1 bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                      placeholder="Thumbnail URL or upload an image →"
                    />
                    <label className="flex items-center gap-2 bg-[#262626] hover:bg-[#333] text-white px-4 py-2.5 rounded-lg text-[13px] cursor-pointer transition-all whitespace-nowrap">
                      {thumbUploadProgress ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload size={14} />
                      )}
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={thumbUploadProgress}
                      />
                    </label>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-[#999] mb-1.5">Video</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={form.videoUrl}
                      onChange={(e) => handleFormChange("videoUrl", e.target.value)}
                      className="flex-1 bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                      placeholder="Video URL or upload a file →"
                    />
                    <label className="flex items-center gap-2 bg-[#262626] hover:bg-[#333] text-white px-4 py-2.5 rounded-lg text-[13px] cursor-pointer transition-all whitespace-nowrap">
                      {uploadProgress ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload size={14} />
                      )}
                      Upload
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={uploadProgress}
                      />
                    </label>
                  </div>
                </div>

                {/* Cast */}
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-[#999] mb-1.5">Cast (comma-separated names)</label>
                  <input
                    type="text"
                    value={form.cast}
                    onChange={(e) => handleFormChange("cast", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                    placeholder="Actor 1, Actor 2, Actor 3"
                  />
                </div>

                {/* Director */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Director Name</label>
                  <input
                    type="text"
                    value={form["director.name"]}
                    onChange={(e) => handleFormChange("director.name", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>

                {/* Music */}
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">Music Director</label>
                  <input
                    type="text"
                    value={form["music.name"]}
                    onChange={(e) => handleFormChange("music.name", e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#262626] hover:bg-[#333] text-white py-3 rounded-lg text-[14px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-[#E50000] hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg text-[14px] font-medium transition-all flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : editingMovie ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
