import { useState } from "react";
import { FiThumbsUp, FiMessageSquare, FiCornerDownRight, FiStar } from "react-icons/fi";

const ReviewList = ({ reviews, onReply, onLike, currentUserId }) => {
  if (reviews.length === 0) {
    return <div className="text-center py-10 text-gray-500">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <ReviewItem 
          key={review._id} 
          review={review} 
          onReply={onReply} 
          onLike={onLike} 
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

const ReviewItem = ({ review, onReply, onLike, currentUserId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(review._id, replyText);
    setReplyText("");
    setShowReplyForm(false);
  };

  const hasLiked = review.likes.includes(currentUserId);

  return (
    <div className="border-b border-gray-100 pb-8 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{review.userName}</span>
            <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={14} className={i < review.rating ? "text-yellow-500 fill-yellow-400" : "text-gray-200"} />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      <div className="flex items-center gap-6 mt-4">
        <button 
          onClick={() => onLike(review._id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${hasLiked ? "text-red-500" : "text-gray-500 hover:text-gray-900"}`}
        >
          <FiThumbsUp size={16} /> {review.likes.length}
        </button>
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FiMessageSquare size={16} /> {review.replies.length} Replies
        </button>
      </div>

      {/* Replies */}
      {review.replies.length > 0 && (
        <div className="ml-8 mt-6 space-y-4 border-l-2 border-gray-50 pl-4">
          {review.replies.map((reply, idx) => (
            <div key={idx} className="flex gap-3">
              <FiCornerDownRight className="text-gray-300 mt-1 flex-shrink-0" size={16} />
              <div className="bg-gray-50/50 p-4 rounded-lg flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-800">{reply.userName}</span>
                  <span className="text-[10px] text-gray-400">• {new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">{reply.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && currentUserId && (
        <div className="ml-8 mt-4 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
          <form onSubmit={handleReplySubmit} className="space-y-3">
            <textarea
              className="w-full p-3 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400"
              placeholder="Reply to this review..."
              rows="2"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 text-xs bg-gray-900 text-white hover:bg-gray-800 rounded transition-colors"
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
