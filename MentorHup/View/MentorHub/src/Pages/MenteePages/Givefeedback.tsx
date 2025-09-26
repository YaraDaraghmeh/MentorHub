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

            // Parse bookingId to number
            const parsedBookingId = parseInt(bookingId, 10);
            if (isNaN(parsedBookingId)) {
                throw new Error('Invalid booking ID format');
            }
            
            console.log('bookingId:', parsedBookingId);
            console.log('token:', token);
            console.log('feedbackData:', feedbackData);
            
            const requestBody = {
                bookingId: parsedBookingId,
                rating: feedbackData.rating,
                comment: feedbackData.comment || "" // Ensure comment is not undefined
            };
            
            console.log('Request body:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch('https://mentor-hub.runasp.net/api/reviews', {
                method: 'POST',
                headers: {
                    'accept': 'text/plain', // Match your Swagger example
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Handle different response types
            let responseData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }
            
            console.log('Response data:', responseData);
            
            if (!response.ok) {
                console.error('API Error Response:', responseData);
                
                // Handle different error response formats
                let errorMessage = `HTTP error! status: ${response.status}`;
                
                if (typeof responseData === 'object' && responseData.message) {
                    errorMessage = responseData.message;
                } else if (typeof responseData === 'string' && responseData.length > 0) {
                    errorMessage = responseData;
                } else if (response.status === 400) {
                    errorMessage = 'Invalid request data. Please check your input.';
                } else if (response.status === 401) {
                    errorMessage = 'Authentication failed. Please log in again.';
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. You may not have permission for this action.';
                } else if (response.status === 404) {
                    errorMessage = 'Booking not found or review endpoint not available.';
                } else if (response.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
                
                throw new Error(errorMessage);
            }
            
            console.log('Feedback submitted successfully:', responseData);
            toast.success('Thank you for your feedback!');
            navigate('/mentee/bookings');
            
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            
            // More specific error handling
            let errorMessage = 'Failed to submit feedback. Please try again.';
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
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