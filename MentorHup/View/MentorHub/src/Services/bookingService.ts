const API_BASE_URL = 'https://mentor-hub.runasp.net/api';

interface BookingServiceResponse {
  success: boolean;
  sessionUrl?: string;
  sessionId?: string;
  error?: string;
}

interface PaymentSuccessResponse {
  success: boolean;
  bookingId?: string;
  message?: string;
  error?: string;
}

class BookingService {
  /**
   * Initiate Stripe checkout for a booking
   */
  async initiateCheckout(
    mentorAvailabilityId: number, 
    token: string, 
    successUrl?: string,
    cancelUrl?: string
  ): Promise<BookingServiceResponse> {
    try {
      console.log('🔧 BookingService: Initiating checkout...', { mentorAvailabilityId });

      const url = `${API_BASE_URL}/bookings/checkout`;
      console.log('🔧 BookingService: Checkout URL:', url);
      console.log('🔧 BookingService: Request payload:', JSON.stringify({
        mentorAvailabilityId: mentorAvailabilityId
      }));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorAvailabilityId: mentorAvailabilityId,
          successUrl: successUrl,
          cancelUrl: cancelUrl
        }),
      });

      console.log('🔧 BookingService: Checkout response status:', response.status);
      console.log('🔧 BookingService: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 BookingService: Checkout HTTP error:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      console.log('🔧 BookingService: Checkout response data:', result);
      console.log('🔧 BookingService: Full response object:', {
        sessionUrl: result.sessionUrl,
        sessionId: result.sessionId,
        success: result.success,
        error: result.error,
        status: response.status,
        statusText: response.statusText,
        fullResult: result // Log the entire result for debugging
      });

      // Handle different possible response structures
      let sessionUrl = result.sessionUrl || result.url || result.checkoutUrl;
      let sessionId = result.sessionId || result.id || result.session_id;

      console.log('🔍 Parsed values:', { sessionUrl, sessionId });

      if (sessionUrl) {
        console.log('✅ Session URL received successfully:', sessionUrl);
        return {
          success: true,
          sessionUrl: sessionUrl,
          sessionId: sessionId,
        };
      } else {
        console.log('❌ No session URL found in response. Available keys:', Object.keys(result));
        return {
          success: false,
          error: result.error || 'No session URL received from payment service',
        };
      }

    } catch (error: any) {
      console.error('🔧 BookingService: Checkout error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate checkout',
      };
    }
  }

  /**
   * Complete booking after successful payment
   */
  async completeBooking(sessionId: string, token: string): Promise<PaymentSuccessResponse> {
    try {
      console.log('🔧 BookingService: Completing booking...', { sessionId });

      const url = `${API_BASE_URL}/bookings/complete`;
      console.log('🔧 BookingService: Complete booking URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId
        }),
      });

      console.log('🔧 BookingService: Complete booking response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 BookingService: Complete booking HTTP error:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      console.log('🔧 BookingService: Complete booking response data:', result);

      return {
        success: true,
        bookingId: result.bookingId,
        message: result.message || 'Booking completed successfully',
      };

    } catch (error: any) {
      console.error('🔧 BookingService: Complete booking error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete booking',
      };
    }
  }

  /**
   * Handle Stripe webhook (this would typically be called by the backend)
   */
  async handleStripeWebhook(webhookData: any): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔧 BookingService: Handling Stripe webhook...');

      const url = `${API_BASE_URL}/payments/stripe-webhook`;
      console.log('🔧 BookingService: Webhook URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('🔧 BookingService: Webhook response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 BookingService: Webhook HTTP error:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true };

    } catch (error: any) {
      console.error('🔧 BookingService: Webhook error:', error);
      return {
        success: false,
        error: error.message || 'Failed to handle webhook',
      };
    }
  }

  /**
   * Open Stripe checkout in a popup window
   */
  openStripeCheckout(sessionUrl: string, onClose?: () => void): Window | null {
    try {
      console.log('🔧 BookingService: Opening Stripe checkout popup...', sessionUrl);
      console.log('🔧 BookingService: Current window location:', window.location.href);

      const popup = window.open(
        sessionUrl,
        'stripe_checkout',
        'width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=yes,menubar=yes'
      );

      console.log('🔧 BookingService: Popup window object:', popup);
      console.log('🔧 BookingService: Popup closed status:', popup?.closed);

      if (!popup) {
        console.error('🔧 BookingService: Failed to open popup window - likely blocked by browser');
        return null;
      }

      // Monitor popup for close
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log('🔧 BookingService: Stripe checkout popup closed');
          if (onClose) {
            onClose();
          }
        }
      }, 1000);

      return popup;

    } catch (error) {
      console.error('🔧 BookingService: Error opening Stripe checkout:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const bookingService = new BookingService();
export default bookingService;
