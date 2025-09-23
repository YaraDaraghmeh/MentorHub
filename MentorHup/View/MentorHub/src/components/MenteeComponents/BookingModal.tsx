import { useState, useMemo, useCallback, memo } from "react";
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
}: {
  bookingData: BookingData;
  isDark: boolean;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
  onBack: () => void;
  availabilityId: number | null;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePopup, setStripePopup] = useState<Window | null>(null);

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
        return;
      }

      console.log(' Initiating Stripe checkout...');
      const checkoutResult = await bookingService.initiateCheckout(availabilityId, token);

      if (!checkoutResult.success) {
        throw new Error(checkoutResult.error || 'Failed to initiate checkout');
      }

      // Check if we have a Stripe session URL
      if (checkoutResult.sessionUrl) {
        console.log('Opening Stripe checkout popup...');

        // Open Stripe in a popup window
        const popup = bookingService.openStripeCheckout(checkoutResult.sessionUrl, () => {
          console.log('Stripe popup closed, checking payment status...');
          if (checkoutResult.sessionId) {
            handlePaymentCompletion(checkoutResult.sessionId);
          } else {
            onError('Payment session ID not found. Please try again.');
          }
        });

        if (popup) {
          setStripePopup(popup);
          console.log('✅ Stripe popup opened successfully');
        } else {
          // Fallback: redirect if popup fails or is blocked
          console.log('❌ Popup failed or blocked, redirecting to Stripe...');
          console.log('🔗 Redirecting to:', checkoutResult.sessionUrl);
          window.location.href = checkoutResult.sessionUrl;
        }
      } else {
        // No session URL received - this means the payment service didn't work
        console.log(' No session URL received from payment service:', checkoutResult);
        console.log('🔍 Debug info:', {
          success: checkoutResult.success,
          sessionUrl: checkoutResult.sessionUrl,
          sessionId: checkoutResult.sessionId,
          error: checkoutResult.error,
          availabilityId: availabilityId
        });

        // For development purposes, if we have a sessionId, we can still try to complete
        // In production, this should show an error
        if (checkoutResult.sessionId && process.env.NODE_ENV === 'development') {
          console.log('🔧 Development mode: Attempting to complete booking with sessionId...');
          await handlePaymentCompletion(checkoutResult.sessionId);
        } else {
          onError(`Payment service error: ${checkoutResult.error || 'No session URL received from payment service'}. Please contact support if this persists.`);
          return;
        }
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      onError(error.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentCompletion = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        onError("Authentication required. Please log in again.");
        return;
      }

      console.log('💳 Completing booking after payment...', { sessionId });

      // Complete the booking
      const completeResult = await bookingService.completeBooking(sessionId, token);

      if (!completeResult.success) {
        throw new Error(completeResult.error || 'Failed to complete booking');
      }

      console.log('✅ Booking completed successfully:', completeResult);

      // Create real payment intent from session ID
      const realPaymentIntent: PaymentIntent = {
        id: sessionId,
        amount: bookingData.total,
        status: "succeeded",
      };

      onSuccess(realPaymentIntent);

    } catch (error: any) {
      console.error("Payment completion error:", error);
      onError(error.message || "Failed to complete booking. Please contact support if money was charged.");
    }
  };

  const handleClosePopup = () => {
    if (stripePopup && !stripePopup.closed) {
      stripePopup.close();
    }
    setStripePopup(null);
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
              Processing...
            </div>
          ) : stripePopup ? (
            <div className="flex items-center justify-center">
              <div className="animate-pulse rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Payment in progress...
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
              <span className="text-sm">Stripe checkout window is open</span>
            </div>
            <button
              onClick={handleClosePopup}
              className="text-sm underline hover:no-underline"
            >
              Close Window
            </button>
          </div>
          <p className="text-xs mt-1 opacity-75">
            Complete your payment in the popup window. This window will update automatically when payment is complete.
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

  // Validate mentor object structure - only check for critical fields
  if (!mentor.id || !mentor.name) {
    console.error('Invalid mentor object - missing id or name:', mentor);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`relative w-[400px] p-6 rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Invalid mentor data</h3>
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              The mentor information is incomplete. Please try again.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("mock-interview"); // Default to mock-interview
  const [duration, setDuration] = useState("60");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: payment, 3: interview-details, 4: success, 5: error
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
        console.warn('No access token found, using fallback user data');
        return currentUser;
      }


      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        name: localStorage.getItem("userName"),
        email: localStorage.getItem("email"),
        avatar: (localStorage.getItem("userName")).charAt(0).toUpperCase(),
      };
    } catch (error) {
      console.error('Error getting user data from token:', error);
      return currentUser;
    }
  }, []);

  const currentUser = getCurrentUser();

  // Memoize sessionTypes to prevent recreation on every render
  const sessionTypes = useMemo(() => {
    if (!mentor) return [];

    const basePrice = typeof mentor.price === 'number' ? mentor.price : 50; // fallback price

    return [
      {
        value: "interview-prep",
        label: "Interview Preparation",
        price: basePrice,
        disabled: true, // Disabled
      },
      {
        value: "resume-review",
        label: "Resume Review",
        price: Math.round(basePrice * 0.8),
        disabled: true, // Disabled
      },
      {
        value: "career-guidance",
        label: "Career Guidance",
        price: Math.round(basePrice * 0.9),
        disabled: true,
      },
      {
        value: "mock-interview",
        label: "Mock Interview",
        price: Math.round(basePrice * 1.1),
        disabled: false,
      },
    ];
  }, [mentor?.price]);


  console.log('BookingModal render - mentor:', mentor);
  console.log('BookingModal render - isOpen:', isOpen);
  console.log('BookingModal render - mentor availabilities:', mentor?.availabilities);

  try {

    const calculateTotal = useCallback(() => {
      try {
        if (!mentor) return 0;

        const sessionPrice =
          sessionTypes.find((type) => type.value === sessionType)?.price ||
          mentor.price ||
          0;


        const selectedSlot = mentor.availabilities?.find(slot => slot.startTime === selectedDate);
        const actualDuration = selectedSlot?.durationInMinutes || parseInt(duration) || 60;
        const durationMultiplier = actualDuration / 60;

        if (isNaN(durationMultiplier) || durationMultiplier <= 0) {
          return 0;
        }

        return Math.round(sessionPrice * durationMultiplier);
      } catch (error) {
        console.error('Error calculating total:', error);
        return 0;
      }
    }, [mentor, sessionTypes, sessionType, selectedDate, duration]);

    const availableSlots = useMemo(() => {
      if (!mentor?.availabilities || !Array.isArray(mentor.availabilities)) return [];
      return mentor.availabilities.filter(slot => slot && !slot.isBooked);
    }, [mentor?.availabilities]);


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
      setStep(2);
    };

    const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
      setPaymentIntentId(paymentIntent.id);
      setStep(3);
    };

    const handlePaymentError = (error: string) => {
      setPaymentError(error);
      setStep(5);
    };

    const handleInterviewDetailsSubmit = () => {

      console.log('Interview details submitted:', interviewDetails);
      setStep(4);
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
        <div
          className={`relative w-[800px]  max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDark ? "border-gray-700 bg-[#071b21]" : "border-gray-200 bg-white"
              }`}
          >
            <h2 className="text-2xl font-bold">
              {step === 1 && "Book a Session"}
              {step === 2 && "Payment Details"}
              {step === 3 && "Interview Details"}
              {step === 4 && "Booking Confirmed!"}
              {step === 5 && "Payment Failed"}
            </h2>
            <button
              onClick={resetModal}
              className={`p-2 rounded-full transition-colors ${isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
            >
              <X size={24} />
            </button>
          </div>

          <div className={`p-6 ${isDark ? "bg-[#071b21]" : "bg-gray-50"}`}>
            {step === 1 && (
              // Step 1: Booking Form
              <>
                {/* Mentor Info */}
                <div
                  className={`p-4 rounded-xl mb-6 ${isDark ? "bg-[#071b21]" : "bg-gray-50"
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold `}
                    >
                      <img
                        src={mentor?.imageLink || defaultprofileimage}
                        alt={mentor?.name || "Mentor"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{mentor?.name || "Unknown Mentor"}</h3>
                      <p
                        className={`${isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
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
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Session Type */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Session Type
                      </label>
                      <div className="space-y-2">
                        {sessionTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${type.disabled
                                ? // Disabled styles
                                isDark
                                  ? "border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed"
                                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                                : // Enabled styles
                                sessionType === type.value
                                  ? isDark
                                    ? "border-[#000000] bg-[#09fb7630] cursor-pointer"
                                    : "border-[#000000] bg-[#09fb7630] opacity-90 cursor-pointer"
                                  : isDark
                                    ? "border-gray-600 hover:border-gray-500 cursor-pointer"
                                    : "border-gray-200 hover:border-gray-300 cursor-pointer"
                              }`}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="sessionType"
                                value={type.value}
                                checked={sessionType === type.value}
                                disabled={type.disabled}
                                onChange={(e) => setSessionType(e.target.value)}
                                className="mr-3"
                              />
                              <span
                                className={type.disabled ? "text-gray-400" : ""}
                              >
                                {type.label}
                              </span>
                            </div>
                            <span
                              className={`font-semibold ${type.disabled ? "text-gray-400" : ""
                                }`}
                            >
                              ${type.price}/hr
                            </span>
                            {type.disabled && (
                              <span className="text-xs text-gray-400 ml-2">
                                (Coming Soon)
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>




                  </div>
                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Available Time Slots */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Available Time Slots
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableSlots.length > 0 ? (
                          availableSlots
                            .map((slot, index) => {
                              const slotId = `${slot.mentorAvailabilityId || index}-${slot.startTime}`;
                              return (
                                <button
                                  key={slotId}
                                  onClick={() => handleSlotSelection(slot)}
                                  className={`w-full p-3 rounded-lg text-left transition-colors border ${selectedDate === slot.startTime
                                      ? isDark
                                        ? "bg-[#27b467] text-white border-[#27b467]"
                                        : "bg-[#27b467] text-white border-[#27b467]"
                                      : isDark
                                        ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4" />
                                      <div>
                                        <div className="font-medium">
                                          {slot.dayOfWeek}
                                        </div>
                                        <div className="text-xs opacity-75">
                                          {slot.startTime ? (
                                            <FormattedDateComponent
                                              isoDateString={slot.startTime}
                                              showTime={false}
                                              dateFormat="short"
                                            />
                                          ) : (
                                            <span>Date unavailable</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4" />
                                      <div className="text-right">
                                        <div className="font-medium">
                                          {slot.startTime && slot.endTime ? (
                                            <>
                                              <FormattedDateComponent
                                                isoDateString={slot.startTime}
                                                showDate={false}
                                              />
                                              {" - "}
                                              <FormattedDateComponent
                                                isoDateString={slot.endTime}
                                                showDate={false}
                                              />
                                            </>
                                          ) : (
                                            <span>Time unavailable</span>
                                          )}
                                        </div>
                                        <div className="text-xs opacity-75">
                                          {slot.durationInMinutes} minutes
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })
                        ) : (
                          <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}>
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No available time slots</p>
                            <p className="text-xs mt-1">Please check back later</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Slot Summary */}
                    {selectedDate && selectedTime && (
                      <div className={`p-3 rounded-lg border ${isDark
                          ? "bg-green-900/20 border-green-700 text-green-300"
                          : "bg-green-50 border-green-200 text-green-800"
                        }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium text-sm">Selected Time Slot</span>
                        </div>
                        <div className="text-sm">
                          {selectedDate ? (
                            <FormattedDateComponent
                              isoDateString={selectedDate}
                              dateFormat="long"
                              className="font-medium"
                            />
                          ) : (
                            <span>No date selected</span>
                          )}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          Duration: {mentor.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes
                        </div>
                      </div>
                    )}

                  </div>
                  {/* Booking Summary */}
                  <div
                    className={`mt-6 p-4 rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span>Session ({mentor.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes)</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-300">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                    className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${selectedDate && selectedTime
                        ? "bg-[#27b467] hover:bg-[#1e874e] text-white"
                        : isDark
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Continue to Payment
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              // Step 2: Payment Form with Stripe Integration
              <>
                {/* Booking Summary */}
                <div
                  className={`p-4 rounded-xl mb-6 ${isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                >
                  <h4 className="font-semibold mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>
                        {mentor?.name || "Unknown Mentor"} -{" "}
                        {sessionTypes.find((t) => t.value === sessionType)?.label || "Unknown Session"}
                      </span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between text-xs opacity-75">
                      <span>
                        {selectedDate ? (
                          <FormattedDateComponent
                            isoDateString={selectedDate}
                            dateFormat="short"
                          />
                        ) : (
                          "No date selected"
                        )}
                      </span>
                      <span>{mentor?.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes</span>
                    </div>
                  </div>
                </div>

                <PaymentForm
                  bookingData={bookingData}
                  isDark={isDark}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onBack={() => setStep(1)}
                  availabilityId={availabilityId}
                />
              </>
            )}

            {step === 3 && (
              // Step 3: Interview Details
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Tell us about your interview</h3>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Help your mentor prepare by sharing details about your upcoming interview
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={interviewDetails.companyName}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, companyName: e.target.value }))}
                        className={`w-full p-3 rounded-lg border ${isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200"
                          }`}
                        placeholder="e.g., Google, Microsoft, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Position Title *
                      </label>
                      <input
                        type="text"
                        value={interviewDetails.positionTitle}
                        onChange={(e) => setInterviewDetails(prev => ({ ...prev, positionTitle: e.target.value }))}
                        className={`w-full p-3 rounded-lg border ${isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-200"
                          }`}
                        placeholder="e.g., Software Engineer, Product Manager"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Experience Level
                    </label>
                    <select
                      value={interviewDetails.experienceLevel}
                      onChange={(e) => setInterviewDetails(prev => ({ ...prev, experienceLevel: e.target.value }))}
                      className={`w-full p-3 rounded-lg border ${isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <option value="">Select your experience level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (3-5 years)</option>
                      <option value="senior">Senior Level (6-10 years)</option>
                      <option value="lead">Lead/Principal (10+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Job Description/Requirements
                    </label>
                    <textarea
                      value={interviewDetails.jobDescription}
                      onChange={(e) => setInterviewDetails(prev => ({ ...prev, jobDescription: e.target.value }))}
                      rows={4}
                      className={`w-full p-3 rounded-lg border ${isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200"
                        }`}
                      placeholder="Paste the job description or key requirements here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Specific Topics or Areas to Focus On
                    </label>
                    <textarea
                      value={interviewDetails.specificTopics}
                      onChange={(e) => setInterviewDetails(prev => ({ ...prev, specificTopics: e.target.value }))}
                      rows={3}
                      className={`w-full p-3 rounded-lg border ${isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200"
                        }`}
                      placeholder="e.g., System design, behavioral questions, coding problems, etc."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(2)}
                      className={`px-6 py-3 rounded-lg border font-medium ${isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleInterviewDetailsSubmit}
                      disabled={!interviewDetails.companyName || !interviewDetails.positionTitle}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${interviewDetails.companyName && interviewDetails.positionTitle
                          ? "bg-[#27b467] hover:bg-[#1e874e] text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Complete Booking
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              // Step 4: Success
              <div className="text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">
                    Payment Successful!
                  </h3>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Your session has been booked and payment processed.
                  </p>
                </div>

                <div
                  className={`text-left p-6 rounded-xl mb-6 ${isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                >
                  <h4 className="font-semibold mb-4">Session Details:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span>{currentUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mentor:</span>
                      <span>{mentor?.name || "Unknown Mentor"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>
                        {selectedDate ? (
                          <FormattedDateComponent
                            isoDateString={selectedDate}
                            dateFormat="long"
                          />
                        ) : (
                          "No date selected"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{mentor.availabilities?.find(slot => slot.startTime === selectedDate)?.durationInMinutes || duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>
                        {sessionTypes.find((t) => t.value === sessionType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
                      <span>Total Paid:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    {paymentIntentId && (
                      <div className="flex justify-between text-xs opacity-75">
                        <span>Payment ID:</span>
                        <span>{paymentIntentId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p
                  className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  You'll receive a confirmation email with meeting details and
                  calendar invite.
                </p>

                <button
                  onClick={resetModal}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {step === 5 && (
              // Step 5: Error
              <div className="text-center">
                <div className="mb-6">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Payment Failed</h3>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-600"
                      } mb-4`}
                  >
                    We couldn't process your payment. Please try again.
                  </p>
                  {paymentError && (
                    <p
                      className={`text-sm p-3 rounded-lg ${isDark
                          ? "bg-red-900/20 text-red-400"
                          : "bg-red-50 text-red-600"
                        }`}
                    >
                      {paymentError}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={resetModal}
                    className={`px-6 py-3 rounded-lg border font-medium ${isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BookingModal render error:', error);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className={`relative w-[400px] p-6 rounded-2xl shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Unable to load the booking modal. Please try again.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default memo(BookingModal);
