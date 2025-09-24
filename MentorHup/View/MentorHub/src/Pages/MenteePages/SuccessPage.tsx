import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    console.log('Success page loaded with session_id:', sessionId);
    
    if (sessionId) {
      // If this page was opened in a popup, communicate with parent
      if (window.opener && !window.opener.closed) {
        console.log('Sending success message to parent window...');
        window.opener.postMessage({
          type: 'STRIPE_PAYMENT_SUCCESS',
          sessionId: sessionId
        }, window.location.origin);
        
        // Close the popup after a brief delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // If this is the main window (redirect case), handle accordingly
        console.log('Payment successful in main window with session ID:', sessionId);
        // You could redirect to a booking confirmation page or show success message
        // For now, we'll redirect back to the main page after a delay
        setTimeout(() => {
          window.location.href = '/mentee/main'; // or wherever your main booking page is
        }, 3000);
      }
    } else {
      console.error('No session_id found in URL parameters');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Your booking has been confirmed. Please wait while we complete the process...
        </p>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-sm text-gray-500">Processing...</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;