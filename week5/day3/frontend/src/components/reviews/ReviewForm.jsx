import { useState } from "react";
import { FiStar } from "react-icons/fi";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ rating, comment });
    setComment("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <label className="text-sm font-medium text-gray-700">Your Rating</label>
          <div className="flex items-center gap-1 ml-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <FiStar
                  size={20}
                  className={`${
                    (hover || rating) >= star ? "text-yellow-500 fill-yellow-400" : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Your Review</label>
        <textarea
          className="w-full p-4 border border-gray-100 bg-gray-50 rounded-lg focus:ring-1 focus:ring-gray-900 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-gray-700 italic"
          placeholder="What did you think of this tea? (Flavor, aroma, brewing experience...)"
          rows="4"
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-gray-900 text-white py-3 px-8 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-sm rounded-sm"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
