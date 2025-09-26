import { useState } from "react";

// Mock theme context for demo
const useTheme = () => ({ isDark: true });

interface FeedbackModalProps {
  open: boolean;
  onClose?: () => void;
  onSubmit: (feedback: any) => Promise<void> | void;
  bookingId?: string;
}

export default function FeedbackModal({
  open = true,
  onClose = () => window.history.back(),
  onSubmit = () => Promise.resolve(),
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
      className={`w-10 h-10 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
        filled 
          ? "text-emerald-400 drop-shadow-sm" 
          : "text-gray-500 hover:text-emerald-300"
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

  const categories = [
    { value: "service", label: "Service Quality", emoji: "✨" },
    { value: "punctuality", label: "Punctuality", emoji: "⏰" },
    { value: "cleanliness", label: "Cleanliness", emoji: "🧽" },
    { value: "communication", label: "Communication", emoji: "💬" },
    { value: "value", label: "Value for Money", emoji: "💰" },
    { value: "other", label: "Other", emoji: "📝" }
  ];

  const isFullScreen = !onClose;

  // Loading state with better animation
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        isDark ? 'bg-gray-900' : 'bg-gray-900'
      }`}>
        <div className="text-center bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-200">Submitting your feedback...</p>
          <p className="text-sm text-gray-400 mt-1">Thank you for your patience</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullScreen ? 'min-h-screen flex items-center justify-center p-4' : ''} ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gray-900'
    } transition-all duration-300`}>
      <div className={`w-full max-w-lg mx-auto ${
        isFullScreen ? 'transform transition-all duration-300' : ''
      }`}>
        
        {/* Main Card */}
        <div className={`${
          isFullScreen ? 'bg-gray-800 rounded-2xl shadow-2xl border border-gray-700' : ''
        } ${isDark && !isFullScreen ? 'bg-gray-800' : 'bg-gray-800'} 
        backdrop-blur-sm p-8 relative overflow-hidden`}>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-600/10 to-teal-500/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              How was your session?
            </h2>
            <p className="text-gray-400 text-lg">
              Your feedback helps us improve our service
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700 text-red-300 rounded-xl text-sm font-medium animate-pulse">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Rating Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-200 mb-4">
              Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex justify-center space-x-2 p-4 bg-gray-700/50 rounded-2xl">
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
            {rating > 0 && (
              <p className="text-center mt-3 text-sm font-medium text-gray-400">
                {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </p>
            )}
          </div>

         

          {/* Comments Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-200 mb-4">
              Additional Comments
            </label>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full p-4 border-2 border-gray-600 bg-gray-700 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 resize-none text-gray-200 placeholder-gray-400"
                placeholder="Share your thoughts about the session... (optional)"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {comment.length}/500
              </div>
            </div>
          </div>

         

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-600 rounded-xl text-lg font-semibold text-gray-300 hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || rating === 0 || !category}
              className={`flex-1 px-6 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-200 transform ${
                isLoading || rating === 0 || !category
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
