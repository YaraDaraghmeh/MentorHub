import { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";

interface FeedbackModalProps {
  open: boolean;
  onClose?: () => void;
  onSubmit: (feedback: any) => Promise<void> | void;
  bookingId?: string;
}

export default function FeedbackModal({
  open = true, // Used by parent components for modal control
  onClose = () => window.history.back(),
  onSubmit,
  bookingId,
}: FeedbackModalProps) {
  const { isDark } = useTheme();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const categories = [
    "General Feedback",
    "Technical Issues",
    "Session Quality",
    "Mentor Performance",
    "Suggestions"
  ];

  const handleSubmit = async () => {
    if (rating === 0 || !category) {
      setError('Please provide a rating and select a category');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const feedbackData = {
        rating,
        category,
        comment,
        wouldRecommend,
        bookingId: bookingId ? parseInt(bookingId, 10) : undefined
      };
      
      await onSubmit?.(feedbackData);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }: any) => (
    <svg
      className={`w-8 h-8 cursor-pointer transition-colors ${
        filled ? "text-yellow-400" : "text-gray-300"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  // Determine if we're in full-screen mode (no parent modal)
  const isFullScreen = !onClose;

  // Render loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        isDark ? 'bg-[var(--primary-dark)]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Submitting your feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullScreen ? 'min-h-screen flex items-center justify-center p-4' : ''} ${
      isDark ? 'bg-[var(--primary-dark)]' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md mx-auto ${
        isFullScreen ? 'bg-white rounded-lg shadow-xl p-6' : ''
      } ${isDark && !isFullScreen ? 'bg-[var(--primary-light)]' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            How was your session?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Your feedback helps us improve our service
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={star <= (hoveredRating || rating)}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Comments
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Share your thoughts about the session..."
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              I would recommend this mentor to others
            </span>
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || rating === 0 || !category}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium text-white ${
              isLoading || rating === 0 || !category
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}