import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { reviewsAPI } from "../../api/reviews";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import toast from "react-hot-toast";

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await reviewsAPI.getReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleAddReview = async (reviewData) => {
    try {
      await reviewsAPI.addReview({
        ...reviewData,
        productId,
        userId: user._id,
        userName: user.name,
      });
      fetchReviews();
      toast.success("Review posted!");
    } catch (err) {
      toast.error("Failed to post review");
    }
  };

  const handleAddReply = async (reviewId, comment) => {
    try {
      await reviewsAPI.addReply(reviewId, {
        userId: user._id,
        userName: user.name,
        comment,
      });
      fetchReviews();
      toast.success("Reply added!");
    } catch (err) {
      toast.error("Failed to add reply");
    }
  };

  const handleLike = async (reviewId) => {
    if (!user) {
      toast.error("Please login to like reviews");
      return;
    }
    try {
      await reviewsAPI.toggleLike(reviewId, {
        userId: user._id,
        userName: user.name,
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-12 border-t border-gray-100 mt-12">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center italic">Customer Reviews</h2>

      <div className="max-w-4xl mx-auto space-y-12">
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Share your thoughts</h3>
            <ReviewForm onSubmit={handleAddReview} />
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">Please login to write a review.</p>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ReviewList 
            reviews={reviews} 
            onReply={handleAddReply} 
            onLike={handleLike} 
            currentUserId={user?._id}
          />
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
