import { useState, useMemo, useCallback, memo } from "react";
import type { Availability, Mentor } from "../../types/types";
import defaultprofileimage from "../../assets/avatar-profile.png";
import { FormattedDateComponent, formatDateTimeUtils } from "../common/FormattedDateComponent";

import {
  X,
  Star,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";

// Type definitions
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
  isDark: boolean;
}

interface MockPaymentIntent {
  id: string;
  amount: number;
  status: string;
}

interface BookingData {
  id: number;
  date: string;
  time: string;
  sessionType: string;
  duration: string;
  total: number;
  notes: string;
}

const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "JD",
};

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
  onSuccess: (paymentIntent: MockPaymentIntent) => void;
  onError: (error: string) => void;
  onBack: () => void;
  availabilityId: number | null;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

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

      const response = await fetch("https://mentor-hub.runasp.net/api/bookings/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorAvailabilityId: availabilityId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Checkout response:", result);

      // Check if we got a Stripe session URL
      if (result.sessionUrl) {
        // Redirect to Stripe checkout
        window.location.href = result.sessionUrl;
      } else {
        // Mock success for development/testing
        const mockPaymentIntent: MockPaymentIntent = {
          id: result.sessionId || `pi_mock_${Date.now()}`,
          amount: bookingData.total * 100, // Convert to cents
          status: "succeeded",
        };
        onSuccess(mockPaymentIntent);
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      onError(error.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className={`px-6 py-3 rounded-lg border font-medium ${
            isDark
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#27b467] hover:bg-[#1e874e]"
          } text-white`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Process Payment ($${bookingData.total})`
          )}
        </button>
      </div>
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
        <div className={`relative w-[400px] p-6 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
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

  // Now all hooks can be called safely - they will always be called in the same order
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("mock-interview"); // Default to mock-interview
  const [duration, setDuration] = useState("60");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: payment, 3: success, 4: error
  const [paymentError, setPaymentError] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [availabilityId, setAvailabilityId] = useState<number | null>(null);

  // Get current user from system
  const currentUser = mockUserData;

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
        disabled: true, // Disabled
      },
      {
        value: "mock-interview",
        label: "Mock Interview",
        price: Math.round(basePrice * 1.1),
        disabled: false, // Only this one is enabled
      },
    ];
  }, [mentor?.price]);

  // Add error boundary to prevent white screen
  // Debug logging
  console.log('BookingModal render - mentor:', mentor);
  console.log('BookingModal render - isOpen:', isOpen);
  console.log('BookingModal render - mentor availabilities:', mentor?.availabilities);
  
  try {

  // const availableTimes = [
  //   "09:00 AM",
  //   "10:00 AM",
  //   "11:00 AM",
  //   "01:00 PM",
  //   "02:00 PM",
  //   "03:00 PM",
  //   "04:00 PM",
  //   "05:00 PM",
  // ];



 

  // Memoize calculateTotal to prevent recalculation on every render
  const calculateTotal = useCallback(() => {
    try {
      if (!mentor) return 0;
      
      const sessionPrice =
        sessionTypes.find((type) => type.value === sessionType)?.price ||
        mentor.price ||
        0;
      
      // Get duration from selected availability slot or fallback to duration state
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

  // Memoize available slots to prevent filtering on every render
  const availableSlots = useMemo(() => {
    if (!mentor?.availabilities || !Array.isArray(mentor.availabilities)) return [];
    return mentor.availabilities.filter(slot => slot && !slot.isBooked);
  }, [mentor?.availabilities]);

  // Memoize slot selection handler
  const handleSlotSelection = useCallback((slot: any) => {
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

  const handlePaymentSuccess = (paymentIntent: MockPaymentIntent) => {
    setPaymentIntentId(paymentIntent.id);
    setStep(3);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setStep(4);
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setSessionType("mock-interview"); // Reset to default enabled type
    setDuration("60");
    setAdditionalNotes("");
    setPaymentError("");
    setPaymentIntentId("");
    onClose();
  };

  const bookingData: BookingData = {
    id: mentor?.id || 0,
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
        className={`relative w-[800px]  max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700 bg-[#071b21]" : "border-gray-200 bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold">
            {step === 1 && "Book a Session"}
            {step === 2 && "Payment Details"}
            {step === 3 && "Booking Confirmed!"}
            {step === 4 && "Payment Failed"}
          </h2>
          <button
            onClick={resetModal}
            className={`p-2 rounded-full transition-colors ${
              isDark
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
                className={`p-4 rounded-xl mb-6 ${
                  isDark ? "bg-[#071b21]" : "bg-gray-50"
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
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-600"
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
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            type.disabled
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
                            className={`font-semibold ${
                              type.disabled ? "text-gray-400" : ""
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

                  {/* Duration
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                */}

               
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
                                  className={`w-full p-3 rounded-lg text-left transition-colors border ${
                                    selectedDate === slot.startTime
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
                          <div className={`text-center py-8 ${
                            isDark ? "text-gray-400" : "text-gray-500"
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
                      <div className={`p-3 rounded-lg border ${
                        isDark 
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
                  className={`mt-6 p-4 rounded-xl ${
                    isDark ? "bg-gray-700" : "bg-gray-50"
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
                  className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    selectedDate && selectedTime
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
            // Step 2: Payment Form with Mock Stripe
            <>
              {/* Booking Summary */}
              <div
                className={`p-4 rounded-xl mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
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
            // Step 3: Success
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
                className={`text-left p-6 rounded-xl mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
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
                className={`text-sm mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-500"
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

          {step === 4 && (
            // Step 4: Error
            <div className="text-center">
              <div className="mb-6">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Payment Failed</h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  We couldn't process your payment. Please try again.
                </p>
                {paymentError && (
                  <p
                    className={`text-sm p-3 rounded-lg ${
                      isDark
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
                  className={`px-6 py-3 rounded-lg border font-medium ${
                    isDark
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
        <div className={`relative w-[400px] p-6 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
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
