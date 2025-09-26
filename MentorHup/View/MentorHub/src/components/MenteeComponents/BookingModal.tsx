import { useState, useMemo, useCallback, memo, useEffect } from "react";
import type { Mentor, Availability } from "../../types/types";
import defaultprofileimage from "../../assets/avatar-profile.png";
import { FormattedDateComponent, formatDateTimeUtils } from "../common/FormattedDateComponent";
import bookingService from "../../Services/bookingService";
import {
  X,
  Star,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
  isDark: boolean;
}

interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface BookingData {
  mentorId: number;
  date: string;
  time: string;
  sessionType: string;
  duration: string;
  total: number;
  notes: string;
}

const PaymentForm = ({
  bookingData,
  isDark,
  onSuccess,
  onError,
  onBack,
  availabilityId,
  onCloseModal,
}: {
  bookingData: BookingData;
  isDark: boolean;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
  onBack: () => void;
  availabilityId: number | null;
  onCloseModal: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePopup, setStripePopup] = useState<Window | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const checkStoredSession = () => {
      const storedSessionId = localStorage.getItem('stripe_session_id');
      if (storedSessionId && isProcessing) {
        console.log('🔍 Found stored session ID:', storedSessionId);
        
        // Complete the payment
        handlePaymentCompletion(storedSessionId);
        
        // Clean up
        localStorage.removeItem('stripe_session_id');
      }
    };
  
    // Check immediately and every second
    checkStoredSession();
    const interval = setInterval(checkStoredSession, 1000);
    
    return () => clearInterval(interval);
  }, [isProcessing]);
  
  // Stable reference to payment completion handler
  const handlePaymentCompletion = useCallback(async (sessionId: string) => {
    try {
      console.log('🔄 Starting payment completion for session:', sessionId);
      setIsProcessing(true);
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      // Complete the booking and verify payment
      const completeResult = await bookingService.completeBooking(sessionId, token);
      console.log('✅ Complete booking result:', completeResult);

      if (!completeResult.success) {
        throw new Error(completeResult.error || 'Failed to verify payment and complete booking');
      }

      // Create payment intent
      const realPaymentIntent: PaymentIntent = {
        id: sessionId,
        amount: bookingData.total,
        status: "succeeded",
      };

      // Clean up URL and storage
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      sessionStorage.removeItem('stripeSessionId');
      sessionStorage.removeItem('currentPaymentId');

      console.log('🎉 Payment completed successfully, calling onSuccess');
      onSuccess(realPaymentIntent);
      return true;
    } catch (error: any) {
      console.error("❌ Payment completion error:", error);
      onError(error.message || "Failed to complete booking.");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [bookingData.total, onSuccess, onError]);

  // 🔥 SOLUTION 1: Enhanced URL monitoring when component mounts
  useEffect(() => {
    const checkForSessionId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        console.log('🔍 Found session_id in URL:', sessionId);
        handlePaymentCompletion(sessionId);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkForSessionId()) return;

    // Set up polling for session_id in URL (backup detection)
    const urlCheckInterval = setInterval(() => {
      if (checkForSessionId()) {
        clearInterval(urlCheckInterval);
      }
    }, 1000);

    return () => {
      clearInterval(urlCheckInterval);
    };
  }, [handlePaymentCompletion]);

  // 🔥 SOLUTION 2: Enhanced popup monitoring with multiple detection methods
  const monitorPopupForCompletion = useCallback((popup: Window) => {
    let checkCount = 0;
    const maxChecks = 300; // 5 minutes max

    const interval = setInterval(() => {
      checkCount++;
      
      try {
        // Method 1: Check popup URL directly
        if (popup.location && popup.location.href.includes('session_id=')) {
          const url = new URL(popup.location.href);
          const sessionId = url.searchParams.get('session_id');
          if (sessionId) {
            console.log('🎯 Detected session_id in popup URL:', sessionId);
            clearInterval(interval);
            popup.close();
            setStripePopup(null);
            handlePaymentCompletion(sessionId);
            return;
          }
        }
      } catch (e) {
        // Cross-origin access blocked, continue with other methods
      }

      // Method 2: Check if popup closed
      if (popup.closed) {
        console.log('🚪 Popup closed, checking main window URL');
        clearInterval(interval);
        setStripePopup(null);
        
        // Give a moment for redirect to complete, then check URL
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const sessionId = urlParams.get('session_id');
          if (sessionId) {
            console.log('🔍 Found session_id after popup closed:', sessionId);
            handlePaymentCompletion(sessionId);
          } else {
            console.log('❌ No session_id found, payment may have been cancelled');
            setIsProcessing(false);
          }
        }, 2000);
        return;
      }

      // Method 3: Timeout protection
      if (checkCount >= maxChecks) {
        console.log('⏰ Popup monitoring timeout');
        clearInterval(interval);
        popup.close();
        setStripePopup(null);
        setIsProcessing(false);
        onError('Payment timeout. Please try again.');
      }
    }, 1000);

    setPollInterval(interval);
  }, [handlePaymentCompletion, onError]);

  // 🔥 SOLUTION 3: Message listener for cross-window communication
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log('📨 Received message:', event.data);
      
      // Accept messages from our domain and Stripe
      if (event.origin === window.location.origin || 
          event.origin === 'https://checkout.stripe.com' ||
          event.origin.includes('stripe.com')) {
        
        // Handle various Stripe completion messages
        let sessionId = null;
        
        if (event.data.type === 'STRIPE_PAYMENT_SUCCESS' && event.data.sessionId) {
          sessionId = event.data.sessionId;
        } else if (event.data.type === 'stripe_checkout_session_complete' && event.data.sessionId) {
          sessionId = event.data.sessionId;
        } else if (event.data.checkout?.session?.id) {
          sessionId = event.data.checkout.session.id;
        } else if (typeof event.data === 'string' && event.data.includes('session_id=')) {
          const match = event.data.match(/session_id=([^&]+)/);
          if (match) sessionId = match[1];
        }
        
        if (sessionId) {
          console.log('🎯 Received payment success message with session:', sessionId);
          if (stripePopup && !stripePopup.closed) {
            stripePopup.close();
          }
          if (pollInterval) {
            clearInterval(pollInterval);
          }
          setStripePopup(null);
          setPollInterval(null);
          await handlePaymentCompletion(sessionId);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [stripePopup, pollInterval, handlePaymentCompletion]);

  // 🔥 SOLUTION 4: Enhanced payment initiation with better success URL
  const handlePayment = async () => {
    if (!availabilityId) {
      onError("No availability slot selected. Please select a time slot.");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        onError("Authentication required. Please log in again.");
        setIsProcessing(false);
        return;
      }

      console.log('🚀 Initiating Stripe checkout...');
      
      // Create a unique success URL that's more likely to be detected
      const timestamp = Date.now();
      const successUrl = `${window.location.origin}${window.location.pathname}?payment_success=true&session_id={CHECKOUT_SESSION_ID}&t=${timestamp}`;
      const cancelUrl = `${window.location.origin}${window.location.pathname}?payment_cancelled=true&t=${timestamp}`;
      
      console.log('🔗 Success URL:', successUrl);
      
      const checkoutResult = await bookingService.initiateCheckout(
        availabilityId, 
        token,
        successUrl,
        cancelUrl
      );

      if (!checkoutResult.success) {
        throw new Error(checkoutResult.error || 'Failed to initiate checkout');
      }

      if (checkoutResult.sessionUrl) {
        console.log('🪟 Opening Stripe checkout popup...');

        // Try popup with better options
        const popup = window.open(
          checkoutResult.sessionUrl,
          'stripe-checkout',
          'width=800,height=800,scrollbars=yes,resizable=yes,location=yes'
        );

        if (popup) {
          setStripePopup(popup);
          console.log('✅ Stripe popup opened successfully');
          
          // Start monitoring the popup
          monitorPopupForCompletion(popup);
          
          // Close the modal since the Stripe popup is open
          onCloseModal();
          
          // Focus the popup
          popup.focus();
          
        } else {
          // Popup blocked, redirect to Stripe
          console.log('🚫 Popup blocked, redirecting to Stripe...');
          // Close the modal before redirecting
          onCloseModal();
          window.location.href = checkoutResult.sessionUrl;
        }
      } else {
        onError('Payment service error. Please try again.');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("💥 Payment processing error:", error);
      onError(error.message || "Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (stripePopup && !stripePopup.closed) {
        stripePopup.close();
      }
    };
  }, [pollInterval, stripePopup]);

  const handleClosePopup = () => {
    console.log('❌ Manually closing Stripe popup');
    if (stripePopup && !stripePopup.closed) {
      stripePopup.close();
    }
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    setStripePopup(null);
    setPollInterval(null);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          disabled={isProcessing || !!stripePopup}
          className={`px-6 py-3 rounded-lg border font-medium ${isDark
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
            } ${isProcessing || stripePopup ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing || !!stripePopup}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors text-white ${isProcessing || stripePopup
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#27b467] hover:bg-[#1e874e]"
            }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying Payment...
            </div>
          ) : stripePopup ? (
            <div className="flex items-center justify-center">
              <div className="animate-pulse rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Complete Payment in Popup
            </div>
          ) : (
            `Process Payment ($${bookingData.total})`
          )}
        </button>
      </div>

      {stripePopup && (
        <div className={`p-4 rounded-lg border ${isDark ? "bg-blue-900/20 border-blue-700 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="text-sm font-medium">Complete your payment in the popup window</span>
            </div>
            <button
              onClick={handleClosePopup}
              className="text-sm underline hover:no-underline font-medium"
            >
              Cancel Payment
            </button>
          </div>
          <p className="text-xs mt-2 opacity-90">
            After completing payment, this window will automatically update. If it doesn't update within 30 seconds, please close and reopen the modal.
          </p>
        </div>
      )}

      {/* 🔥 SOLUTION 5: Manual check button as backup */}
      {isProcessing && !stripePopup && (
        <div className={`p-4 rounded-lg border ${isDark ? "bg-yellow-900/20 border-yellow-700 text-yellow-300" : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="text-sm">Verifying your payment...</span>
            </div>
            <button
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                const sessionId = urlParams.get('session_id');
                if (sessionId) {
                  console.log('🔄 Manual verification triggered');
                  handlePaymentCompletion(sessionId);
                } else {
                  setIsProcessing(false);
                  onError('No payment session found. Please try again.');
                }
              }}
              className="text-sm underline hover:no-underline font-medium"
            >
              Check Status
            </button>
          </div>
          <p className="text-xs mt-1 opacity-75">
            Payment taking longer than expected? Click "Check Status" if you completed payment.
          </p>
        </div>
      )}
    </div>
  );
};

const BookingModal = ({
  isOpen,
  onClose,
  mentor,
  isDark,
}: BookingModalProps) => {
  // CRITICAL: All early returns must be BEFORE any hooks (including useState)
  if (!isOpen || !mentor) return null;

  // Validate mentor object structure
  if (!mentor.id || !mentor.name) {
    console.error('Invalid mentor object - missing id or name:', mentor);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`relative w-[400px] p-6 rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Invalid mentor data</h3>
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              The mentor information is incomplete. Please try again.
            </p>
            <button onClick={onClose} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal state management
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("mock-interview");
  const [duration, setDuration] = useState("60");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [step, setStep] = useState(1); // ✅ This controls which step is shown in the modal
  const [paymentError, setPaymentError] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [availabilityId, setAvailabilityId] = useState<number | null>(null);
  const [interviewDetails, setInterviewDetails] = useState({
    companyName: "",
    positionTitle: "",
    jobDescription: "",
    experienceLevel: "",
    specificTopics: "",
  });

  // Get current user from system
  const getCurrentUser = useCallback((): UserData => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return {
          name: localStorage.getItem("userName") || "User",
          email: localStorage.getItem("email") || "user@example.com",
          avatar: "U",
        };
      }

      return {
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("email") || "user@example.com",
        avatar: (localStorage.getItem("userName") || "User").charAt(0).toUpperCase(),
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return { name: "User", email: "user@example.com", avatar: "U" };
    }
  }, []);

  const currentUser = getCurrentUser();

  // Session types with pricing
  const sessionTypes = useMemo(() => {
    if (!mentor) return [];
    const basePrice = typeof mentor.price === 'number' ? mentor.price : 50;
    return [
      { value: "interview-prep", label: "Interview Preparation", price: basePrice, disabled: true },
      { value: "resume-review", label: "Resume Review", price: Math.round(basePrice * 0.8), disabled: true },
      { value: "career-guidance", label: "Career Guidance", price: Math.round(basePrice * 0.9), disabled: true },
      { value: "mock-interview", label: "Mock Interview", price: Math.round(basePrice * 1), disabled: false },
    ];
  }, [mentor?.price]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    try {
      if (!mentor) return 0;
      const sessionPrice = sessionTypes.find((type) => type.value === sessionType)?.price || mentor.price || 0;
      const selectedSlot = mentor.availabilities?.find(slot => slot.startTime === selectedDate);
      const actualDuration = selectedSlot?.durationInMinutes || parseInt(duration) || 60;
      const durationMultiplier = actualDuration / 60;
      if (isNaN(durationMultiplier) || durationMultiplier <= 0) return 0;
      return Math.round(sessionPrice * durationMultiplier);
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  }, [mentor, sessionTypes, sessionType, selectedDate, duration]);

  // Available time slots
  const availableSlots = useMemo(() => {
    if (!mentor?.availabilities || !Array.isArray(mentor.availabilities)) return [];
    return mentor.availabilities.filter(slot => slot && !slot.isBooked);
  }, [mentor?.availabilities]);

  // Event handlers
  const handleSlotSelection = useCallback((slot: Availability) => {
    try {
      console.log("Selected slot:", slot.mentorAvailabilityId);
      setAvailabilityId(slot.mentorAvailabilityId);
      setSelectedDate(slot.startTime);
      if (slot.startTime) {
        setSelectedTime(formatDateTimeUtils.getTimeOnly(slot.startTime, true));
      }
    } catch (error) {
      console.error('Error in handleSlotSelection:', error);
    }
  }, []);

  const handleBooking = () => {
    setStep(2); // ✅ Move to payment step
  };

  // ✅ CRITICAL: These callbacks update the modal state
  const handlePaymentSuccess = useCallback((paymentIntent: PaymentIntent) => {
    console.log('✅ Payment success - updating modal to step 3:', paymentIntent);
    setPaymentIntentId(paymentIntent.id);
    setPaymentError(""); // Clear any previous errors
    setStep(3); // ✅ Move to interview details step
  }, []);

  const handlePaymentError = useCallback((error: string) => {
    console.log('❌ Payment error - updating modal to step 5:', error);
    setPaymentError(error);
    setStep(5); // ✅ Move to error step
  }, []);

  const handleInterviewDetailsSubmit = () => {
    console.log('Interview details submitted:', interviewDetails);
    setStep(4); // ✅ Move to success step
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setSessionType("mock-interview");
    setDuration("60");
    setAdditionalNotes("");
    setPaymentError("");
    setPaymentIntentId("");
    setAvailabilityId(null);
    setInterviewDetails({
      companyName: "",
      positionTitle: "",
      jobDescription: "",
      experienceLevel: "",
      specificTopics: "",
    });
    onClose();
  };

  const bookingData: BookingData = {
    mentorId: mentor?.id || 0,
    date: selectedDate,
    time: selectedTime,
    sessionType,
    duration,
    total: calculateTotal(),
    notes: additionalNotes,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`relative w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        
        {/* Modal Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDark ? "border-gray-700 bg-[#071b21]" : "border-gray-200 bg-white"}`}>
          <h2 className="text-2xl font-bold">
            {step === 1 && "Book a Session"}
            {step === 2 && "Payment Details"}
            {step === 3 && "Interview Details"}
            {step === 4 && "Booking Confirmed!"}
            {step === 5 && "Payment Failed"}
          </h2>
          <button onClick={resetModal} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"}`}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className={`p-6 ${isDark ? "bg-[#071b21]" : "bg-gray-50"}`}>
          
          {/* Step 1: Booking Selection */}
          {step === 1 && (
            <>
              {/* Mentor Info */}
              <div className={`p-4 rounded-xl mb-6 ${isDark ? "bg-[#071b21]" : "bg-gray-50"}`}>
                <div className="flex items-center space-x-4">
                  <img src={mentor?.imageLink || defaultprofileimage} alt={mentor?.name || "Mentor"} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{mentor?.name || "Unknown Mentor"}</h3>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {mentor?.field || "Unknown Field"} at {mentor?.companyName || "Unknown Company"}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{typeof mentor?.reviewCount === 'number' ? mentor.reviewCount : 0}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>${typeof mentor?.price === 'number' ? mentor.price : 0}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Session Type Selection */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Session Type</label>
                    <div className="space-y-2">
                      {sessionTypes.map((type) => (
                        <label key={type.value} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${type.disabled ? "opacity-50 cursor-not-allowed" : sessionType === type.value ? "border-[#27b467] bg-[#27b467]/10" : "border-gray-300 hover:border-gray-400"}`}>
                          <div className="flex items-center">
                            <input type="radio" name="sessionType" value={type.value} checked={sessionType === type.value} disabled={type.disabled} onChange={(e) => setSessionType(e.target.value)} className="mr-3" />
                            <span>{type.label}</span>
                          </div>
                          <span className="font-semibold">${type.price}/hr</span>
                          {type.disabled && <span className="text-xs text-gray-400 ml-2">(Coming Soon)</span>}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Available Time Slots */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Available Time Slots</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot, index) => (
                          <button key={`${slot.mentorAvailabilityId || index}-${slot.startTime}`} onClick={() => handleSlotSelection(slot)} className={`w-full p-3 rounded-lg text-left transition-colors border ${selectedDate === slot.startTime ? "bg-[#27b467] text-white border-[#27b467]" : isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600" : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{slot.dayOfWeek}</div>
                                  <div className="text-xs opacity-75">
                                    {slot.startTime && <FormattedDateComponent isoDateString={slot.startTime} showTime={false} dateFormat="short" />}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <div className="text-right">
                                  <div className="font-medium">
                                    {slot.startTime && slot.endTime && (
                                      <>
                                        <FormattedDateComponent isoDateString={slot.startTime} showDate={false} />
                                        {" - "}
                                        <FormattedDateComponent isoDateString={slot.endTime} showDate={false} />
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xs opacity-75">{slot.durationInMinutes} minutes</div>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No available time slots</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Slot Summary */}
                  {selectedDate && selectedTime && (
                    <div className={`p-3 rounded-lg border ${isDark ? "bg-green-900/20 border-green-700 text-green-300" : "bg-green-50 border-green-200 text-green-800"}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium text-sm">Selected Time Slot</span>
                      </div>
                      <div className="text-sm">
                        <FormattedDateComponent isoDateString={selectedDate} dateFormat="long" className="font-medium" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Summary */}
              <div className={`mt-6 p-4 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span>Session ({mentor.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button onClick={handleBooking} disabled={!selectedDate || !selectedTime} className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${selectedDate && selectedTime ? "bg-[#27b467] hover:bg-[#1e874e] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                Continue to Payment
              </button>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <>
              <div className={`p-4 rounded-xl mb-6 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{mentor?.name} - {sessionTypes.find((t) => t.value === sessionType)?.label}</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-xs opacity-75">
                    <span><FormattedDateComponent isoDateString={selectedDate} dateFormat="short" /></span>
                    <span>{mentor?.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes</span>
                  </div>
                </div>
              </div>

               {/* 🔥 HERE IS WHERE THE PAYMENTFORM COMPONENT GOES */}
               <PaymentForm
                bookingData={bookingData}
                isDark={isDark}
                onSuccess={handlePaymentSuccess}  // ← This moves modal to step 3
                onError={handlePaymentError}      // ← This moves modal to step 5
                onBack={() => setStep(1)}         // ← This goes back to step 1
                availabilityId={availabilityId}
                onCloseModal={onClose}
              />
            
            </>
          )}

          {/* Step 3: Interview Details */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Tell us about your interview</h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>Help your mentor prepare by sharing details about your upcoming interview</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <input type="text" value={interviewDetails.companyName} onChange={(e) => setInterviewDetails(prev => ({ ...prev, companyName: e.target.value }))} className={`w-full p-3 rounded-lg border text-base ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`} placeholder="e.g., Google, Microsoft, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Position Title *</label>
                    <input type="text" value={interviewDetails.positionTitle} onChange={(e) => setInterviewDetails(prev => ({ ...prev, positionTitle: e.target.value }))} className={`w-full p-3 rounded-lg border text-base ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`} placeholder="e.g., Software Engineer, Product Manager" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select value={interviewDetails.experienceLevel} onChange={(e) => setInterviewDetails(prev => ({ ...prev, experienceLevel: e.target.value }))} className={`w-full p-3 rounded-lg border text-base ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`}>
                    <option value="">Select your experience level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6-10 years)</option>
                    <option value="lead">Lead/Principal (10+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Description/Requirements</label>
                  <textarea value={interviewDetails.jobDescription} onChange={(e) => setInterviewDetails(prev => ({ ...prev, jobDescription: e.target.value }))} rows={4} className={`w-full p-3 rounded-lg border text-base ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`} placeholder="Paste the job description or key requirements here..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Specific Topics or Areas to Focus On</label>
                  <textarea value={interviewDetails.specificTopics} onChange={(e) => setInterviewDetails(prev => ({ ...prev, specificTopics: e.target.value }))} rows={3} className={`w-full p-3 rounded-lg border text-base ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"}`} placeholder="e.g., System design, behavioral questions, coding problems, etc." />
                </div>

                <div className="flex space-x-4">
                  <button onClick={() => setStep(2)} className={`px-6 py-3 rounded-lg border font-medium ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                    Back
                  </button>
                  <button onClick={handleInterviewDetailsSubmit} disabled={!interviewDetails.companyName || !interviewDetails.positionTitle} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${interviewDetails.companyName && interviewDetails.positionTitle ? "bg-[#27b467] hover:bg-[#1e874e] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    Complete Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Payment Successful!</h3>
              <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Your session has been booked and payment processed.</p>

              <div className={`text-left p-6 rounded-xl mb-6 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <h4 className="font-semibold mb-4">Session Details:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Customer:</span><span>{currentUser.name}</span></div>
                  <div className="flex justify-between"><span>Email:</span><span>{currentUser.email}</span></div>
                  <div className="flex justify-between"><span>Mentor:</span><span>{mentor?.name}</span></div>
                  <div className="flex justify-between"><span>Date & Time:</span><span><FormattedDateComponent isoDateString={selectedDate} dateFormat="long" /></span></div>
                  <div className="flex justify-between"><span>Duration:</span><span>{mentor.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes</span></div>
                  <div className="flex justify-between"><span>Type:</span><span>{sessionTypes.find((t) => t.value === sessionType)?.label}</span></div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-300"><span>Total Paid:</span><span>${calculateTotal()}</span></div>
                  {paymentIntentId && <div className="flex justify-between text-xs opacity-75"><span>Payment ID:</span><span>{paymentIntentId}</span></div>}
                </div>
              </div>

              <button onClick={resetModal} className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                Done
              </button>
            </div>
          )}

          {/* Step 5: Error */}
          {step === 5 && (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Payment Failed</h3>
              <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>We couldn't process your payment. Please try again.</p>
              {paymentError && (
                <p className={`text-sm p-3 rounded-lg mb-6 ${isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"}`}>
                  {paymentError}
                </p>
              )}

              <div className="flex space-x-4">
                <button onClick={() => setStep(2)} className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Try Again
                </button>
                <button onClick={resetModal} className={`px-6 py-3 rounded-lg border font-medium ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(BookingModal);