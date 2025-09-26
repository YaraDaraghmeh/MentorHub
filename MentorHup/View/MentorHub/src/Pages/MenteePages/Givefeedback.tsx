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

    const handleSubmit = async (feedbackData: { 
        rating: number; 
        comment: string; 
        bookingId?: number;
    }) => {
        try {
            console.log('Submitting feedback:', feedbackData);
            
            if (!bookingId) {
                throw new Error('No booking ID provided');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required. Please log in again.');
            }
            
            const response = await fetch('https://mentor-hub.runasp.net/api/reviews', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: parseInt(bookingId, 10),
                    rating: feedbackData.rating,
                    comment: feedbackData.comment,
               
                })
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                console.error('API Error Response:', responseData);
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
            }
            
            console.log('Feedback submitted successfully:', responseData);
            toast.success('Thank you for your feedback!');
            navigate('/mentee/bookings');
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
            throw error; // Re-throw to be caught by the SessionReview component
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
