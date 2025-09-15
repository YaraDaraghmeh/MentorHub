import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";

interface FeedbackModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
    rating: number;
    category: string;
    comment: string;
    wouldRecommend: boolean;
}

export default function FeedbackModal({
    open,
    onClose,
    onSubmit,
}: FeedbackModalProps) {
    const { isDark } = useTheme();
    const [rating, setRating] = useState<number>(0);
    const [category, setCategory] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [wouldRecommend, setWouldRecommend] = useState<boolean>(false);
    const [hoveredRating, setHoveredRating] = useState<number>(0);

    const categories = [
        "User Experience",
        "Performance",
        "Features",
        "Bug Report",
        "Suggestion",
        "Other"
    ];

    const handleSubmit = () => {
        if (rating === 0 || !category) {
            // You might want to show validation errors here
            return;
        }

        const feedbackData: FeedbackData = {
            rating,
            category,
            comment,
            wouldRecommend,
        };

        onSubmit(feedbackData);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setRating(0);
        setCategory("");
        setComment("");
        setWouldRecommend(false);
        setHoveredRating(0);
        onClose();
    };

    const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }: {
        filled: boolean;
        onClick: () => void;
        onMouseEnter: () => void;
        onMouseLeave: () => void;
    }) => (
        <svg
            className={`w-8 h-8 cursor-pointer transition-colors ${filled ? "text-yellow-400" : "text-gray-300"
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

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={handleClose}>
                {/* Background overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                {/* Modal content */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className={`w-full max-w-md p-6 rounded-lg shadow-xl ${isDark ? "bg-[var(--primary-light)]" : "bg-white"
                                }`}
                        >
                            <Dialog.Title
                                className={`text-xl font-semibold mb-4 ${isDark
                                        ? "text-[var(--secondary-light)]"
                                        : "text-[var(--primary-light)]"
                                    }`}
                            >
                                How was your session?
                            </Dialog.Title>

                            {/* Rating Section */}
                            <div className="mb-6">
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark
                                            ? "text-[var(--secondary-light)]"
                                            : "text-[var(--primary-light)]"
                                        }`}
                                >
                                    Rate your experience *
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

                            
                            {/* Comment Section */}
                            <div className="mb-6">
                                <label
                                    className={`block text-sm font-medium mb-2 ${isDark
                                            ? "text-[var(--secondary-light)]"
                                            : "text-[var(--primary-light)]"
                                        }`}
                                >
                                    Additional comments (optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us more about your experience..."
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isDark
                                            ? "bg-[var(--primary)] border-[var(--System-Gray-300)] text-[var(--secondary-light)] placeholder-[var(--System-Gray-300)]"
                                            : "bg-white border-gray-300 text-[var(--primary-light)] placeholder-gray-400"
                                        }`}
                                />
                            </div>

                            {/* Recommendation Question */}
                            <div className="mb-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={wouldRecommend}
                                        onChange={(e) => setWouldRecommend(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span
                                        className={`text-sm ${isDark
                                                ? "text-[var(--secondary-light)]"
                                                : "text-[var(--primary-light)]"
                                            }`}
                                    >
                                        I would recommend this to others
                                    </span>
                                </label>
                            </div>


                            {/* Action Buttons */}
                            <div className="flex justify-between space-x-3">
                                <button
                                    className={`flex-1 px-4 py-2 border border-[#36414f] text-sm rounded-lg tracking-wider transition-colors ${isDark
                                            ? "bg-[#36414f] text-white hover:bg-[#2a323c]"
                                            : "bg-white text-[var(--primary)] hover:bg-gray-50"
                                        }`}
                                    onClick={handleClose}
                                >
                                    Skip for now
                                </button>
                                <button
                                    className={`flex-1 px-4 py-2 font-semibold rounded-lg text-sm text-white transition-colors ${rating === 0 || !category
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || !category}
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
