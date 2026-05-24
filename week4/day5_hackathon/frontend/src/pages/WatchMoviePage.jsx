import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
  Calendar,
  Languages,
  Star,
  Grid2X2,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import TrialBox from "../components/TrialBox";
import Footer from "../components/Footer";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/VideoPlayer";

const WatchMoviePage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isPlaying, setIsPlaying] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLocation, setReviewLocation] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (id) {
      fetchMovie();
      fetchReviews();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/movies/${id}`);
      if (data.success) {
        setMovie(data.movie);
      }
    } catch (error) {
      console.error("Failed to fetch movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${id}`);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!reviewText || !reviewRating) {
      setReviewError("Please provide a rating and review text.");
      return;
    }

    try {
      setReviewLoading(true);
      const { data } = await API.post("/reviews", {
        movieId: id,
        rating: reviewRating,
        text: reviewText,
        location: reviewLocation || "Unknown",
      });
      if (data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setShowReviewForm(false);
        setReviewText("");
        setReviewRating(5);
        setReviewLocation("");
      }
    } catch (error) {
      setReviewError(
        error.response?.data?.message || "Failed to add review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // Star rating component
  const StarRating = ({ rating, max = 5, interactive = false, onChange }) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(rating)
                ? "text-[#E50000] fill-[#E50000]"
                : "text-[#E50000]"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && onChange && onChange(i + 1)}
          />
        ))}
        <span className="text-[14px] text-white ml-1">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="w-10 h-10 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414] text-white">
        <p className="text-[#999]">Movie not found.</p>
      </div>
    );
  }

  // Metadata sidebar content
  const MetadataSection = () => (
    <div className="flex flex-col gap-5">
      {/* Released Year */}
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
        <div className="flex items-center gap-2 text-[#999999] mb-2">
          <Calendar size={16} />
          <span className="text-[14px]">Released Year</span>
        </div>
        <p className="text-white text-[18px] font-semibold">
          {movie.releaseYear}
        </p>
      </div>

      {/* Available Languages */}
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
        <div className="flex items-center gap-2 text-[#999999] mb-3">
          <Languages size={16} />
          <span className="text-[14px]">Available Languages</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(movie.languages || ["English"]).map((lang, idx) => (
            <span
              key={idx}
              className="bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-md text-[14px] text-white"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
        <div className="flex items-center gap-2 text-[#999999] mb-3">
          <Star size={16} />
          <span className="text-[14px]">Ratings</span>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 flex-1">
            <p className="text-[14px] text-white font-semibold mb-1">IMDb</p>
            <StarRating rating={movie.ratings?.imdb || 0} />
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 flex-1">
            <p className="text-[14px] text-white font-semibold mb-1">
              Streamvibe
            </p>
            <StarRating rating={movie.ratings?.streamvibe || 0} />
          </div>
        </div>
      </div>

      {/* Genres */}
      <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
        <div className="flex items-center gap-2 text-[#999999] mb-3">
          <Grid2X2 size={16} />
          <span className="text-[14px]">Genres</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(movie.genre || []).map((genre, idx) => (
            <span
              key={idx}
              className="bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-md text-[14px] text-white"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Director */}
      {movie.director?.name && (
        <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
          <p className="text-[#999999] text-[14px] mb-3">Director</p>
          <div className="flex items-center gap-3">
            <img
              src={movie.director.image || "https://i.pravatar.cc/150?img=11"}
              alt={movie.director.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold text-[16px]">
                {movie.director.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Music */}
      {movie.music?.name && (
        <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
          <p className="text-[#999999] text-[14px] mb-3">Music</p>
          <div className="flex items-center gap-3">
            <img
              src={movie.music.image || "https://i.pravatar.cc/150?img=12"}
              alt={movie.music.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold text-[16px]">
                {movie.music.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="text-white">
      {/* Hero Banner / Video Player */}
      <div className="lg:px-10 px-2 mt-10">
        {isPlaying && movie.videoUrl ? (
          <VideoPlayer 
            videoUrl={movie.videoUrl} 
            poster={movie.thumbnail || "/assets/avengers-img.png"} 
            title={movie.title}
          />
        ) : (
          <div
            className="bg-cover bg-center bg-no-repeat pt-40 lg:pt-50 pb-5 rounded-lg"
            style={{
              backgroundImage: `url('${movie.thumbnail || "/assets/avengers-img.png"}')`,
            }}
          >
            <div className="flex flex-col items-center text-center gap-4 bg-black/40 p-5 rounded-lg mx-5 lg:mx-20 backdrop-blur-sm">
              <h1 className="lg:text-[38px] text-[24px] font-bold drop-shadow-lg">
                {movie.title}
              </h1>
              <p className="text-[#ccc] lg:text-[18px] text-[14px] lg:block hidden max-w-3xl px-10 drop-shadow-md">
                {movie.description}
              </p>
  
              {/* Play Button */}
              <button
                onClick={() => {
                  if (movie.videoUrl) {
                    setIsPlaying(true);
                  } else {
                    alert("Video not available yet.");
                  }
                }}
                className="bg-[#E50000] hover:bg-red-700 border transition-all border-black px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Play fill="white" size={18} />
                Play Now
              </button>

            {/* Action icons */}
            <div className="flex items-center gap-2">
              <div className="bg-[#0F0F0F] hover:bg-black transition-all p-2 border border-[#262626] rounded-md cursor-pointer">
                <Plus />
              </div>
              <div className="bg-[#0F0F0F] hover:bg-black transition-all p-2 border border-[#262626] rounded-md cursor-pointer">
                <ThumbsUp />
              </div>
              <div className="bg-[#0F0F0F] hover:bg-black transition-all p-2 border border-[#262626] rounded-md cursor-pointer">
                <Volume2 />
              </div>
            </div>

            {/* Arrow navigation - desktop only */}
            <div className="hidden lg:flex items-center justify-between w-full px-10 mt-5">
              <div className="bg-[#0F0F0F] border border-[#1f1f1f] p-1 cursor-pointer transition-all rounded-sm">
                <ArrowLeft size={24} />
              </div>
              <div className="bg-[#0F0F0F] border border-[#1f1f1f] p-1 cursor-pointer transition-all rounded-sm">
                <ArrowRight size={24} />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Content Section */}
      <div className="lg:px-10 px-2 mt-10">
        <div className="flex lg:flex-row flex-col gap-6">
          {/* Left Column - Description, Cast, Reviews */}
          <div className="lg:w-[60%] w-full flex flex-col gap-6">
            {/* Description */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
              <p className="text-[#999999] text-[14px] mb-2">Description</p>
              <p className="text-white text-[16px] leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Mobile: Metadata comes after Description */}
            {isMobile && <MetadataSection />}

            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[#999999] text-[14px]">Cast</p>
                  <div className="flex gap-2">
                    <div className="castPrev bg-[#141414] border border-[#262626] p-1.5 cursor-pointer rounded-md">
                      <ArrowLeft size={16} />
                    </div>
                    <div className="castNext bg-[#141414] border border-[#262626] p-1.5 cursor-pointer rounded-md">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: ".castNext",
                    prevEl: ".castPrev",
                  }}
                  spaceBetween={12}
                  breakpoints={{
                    320: { slidesPerView: 4, spaceBetween: 8 },
                    768: { slidesPerView: 6, spaceBetween: 12 },
                    1024: { slidesPerView: 7, spaceBetween: 12 },
                  }}
                >
                  {movie.cast.map((actor, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={
                          actor.image ||
                          `https://i.pravatar.cc/150?img=${idx + 10}`
                        }
                        alt={actor.name}
                        className="w-16 h-16 lg:w-18 lg:h-18 rounded-full object-cover border-2 border-[#262626] mx-auto"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[#999999] text-[14px]">Reviews</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center gap-1 bg-[#141414] border border-[#262626] px-3 py-2 rounded-md text-[14px] hover:bg-[#1f1f1f] transition-all"
                  >
                    {showReviewForm ? (
                      <>
                        <X size={14} />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add Your Review
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="bg-[#141414] border border-[#262626] rounded-lg p-4 mb-4"
                >
                  {reviewError && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg mb-3 text-[13px]">
                      {reviewError}
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[#999] text-[12px] block mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <Star
                            key={val}
                            size={20}
                            className={`cursor-pointer transition-colors ${
                              val <= reviewRating
                                ? "text-[#E50000] fill-[#E50000]"
                                : "text-[#555]"
                            }`}
                            onClick={() => setReviewRating(val)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[#999] text-[12px] block mb-1">
                        Location (optional)
                      </label>
                      <input
                        type="text"
                        value={reviewLocation}
                        onChange={(e) => setReviewLocation(e.target.value)}
                        placeholder="From India"
                        className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg px-3 py-2 text-white text-[13px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[#999] text-[12px] block mb-1">
                        Your Review
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                        placeholder="Write your review..."
                        className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg px-3 py-2 text-white text-[13px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="bg-[#E50000] hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center"
                    >
                      {reviewLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {reviews.length > 0 ? (
                <>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                      nextEl: ".reviewNext",
                      prevEl: ".reviewPrev",
                    }}
                    pagination={{ clickable: true }}
                    spaceBetween={16}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                    }}
                  >
                    {reviews.map((review, idx) => (
                      <SwiperSlide key={review._id || idx}>
                        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 min-h-[180px]">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-white font-semibold text-[16px]">
                                {review.userName || review.name}
                              </p>
                              <p className="text-[#999999] text-[12px]">
                                {review.location}
                              </p>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-[#999999] text-[14px] mt-3 leading-relaxed">
                            {review.text}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="reviewPrev bg-[#141414] border border-[#262626] p-1.5 cursor-pointer rounded-md">
                      <ArrowLeft size={16} />
                    </div>
                    <div className="reviewNext bg-[#141414] border border-[#262626] p-1.5 cursor-pointer rounded-md">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-[#999] text-[14px] text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Metadata (Desktop only) */}
          {!isMobile && (
            <div className="lg:w-[40%] w-full">
              <MetadataSection />
            </div>
          )}
        </div>
      </div>

      {/* Trial Box */}
      <div className="lg:px-10 px-2">
        <TrialBox />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WatchMoviePage;
