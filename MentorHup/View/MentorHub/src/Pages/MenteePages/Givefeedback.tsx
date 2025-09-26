import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackModal from '../../components/SessionReview/SessionReview';

// Simple toast implementation since react-toastify is not installed
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
};

const Givefeedback = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const handleClose = () => {
        // Navigate to a default page after closing
        navigate('/mentee/bookings');
    };

    const handleSubmit = async (feedbackData: { rating: number; category: string; comment: string; wouldRecommend: boolean }) => {
        if (!bookingId) return;
        
        try {
            const token = localStorage.getItem('token'); // or your auth token storage
            
            const response = await fetch('https://mentor-hub.runasp.net/api/reviews', {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: parseInt(bookingId, 10),
                    rating: feedbackData.rating,
                    comment: feedbackData.comment
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit feedback');
            }
            
            toast.success('Thank you for your feedback!');
            navigate('/mentee/bookings');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback. Please try again.');
        }
    };

    // If no bookingId is provided, show an error and redirect
    useEffect(() => {
        if (!bookingId) {
            toast.error('Invalid feedback link');
            navigate('/mentee/bookings');
        }
    }, [bookingId, navigate]);

    if (!bookingId) {
        return null; // or a loading/error component
    }

    return (
        <FeedbackModal 
            bookingId={bookingId}
            onClose={handleClose} 
            onSubmit={handleSubmit} 
            open={true}
        />
    );
};

export default Givefeedback;
